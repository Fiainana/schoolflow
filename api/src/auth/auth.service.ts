import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes, randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { IsNull, LessThan, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './refresh-token.entity';

// Hash factice : le temps de réponse reste le même quand le login n'existe pas.
const FAUX_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO5GmCJbCSjXzdHqkVZqS8VqTf2dQ1q6e';

/** Deux rafraîchissements simultanés (deux onglets) ne doivent pas être pris pour un vol de jeton. */
const TOLERANCE_REUTILISATION_MS = 15_000;

export type Contexte = { userAgent?: string; ip?: string };

export type Session = {
  accessToken: string;
  accessExpiresIn: number; // secondes
  refreshToken: string;
  refreshExpiresIn: number; // secondes
  user: { id: number; login: string; nom: string; roles: string[] };
};

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex');

@Injectable()
export class AuthService {
  private readonly log = new Logger(AuthService.name);
  readonly accessTtl: number;
  readonly refreshTtl: number;

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    cfg: ConfigService,
    @InjectRepository(RefreshToken) private readonly tokens: Repository<RefreshToken>,
  ) {
    this.accessTtl = Number(cfg.get('ACCESS_TOKEN_MINUTES', 15)) * 60;
    this.refreshTtl = Number(cfg.get('REFRESH_TOKEN_DAYS', 7)) * 86400;
  }

  async login(login: string, password: string, ctx: Contexte): Promise<Session> {
    const user = await this.users.findByLogin(login);
    const ok = await bcrypt.compare(password, user?.passwordHash ?? FAUX_HASH);
    if (!user || !user.actif || !ok) throw new UnauthorizedException('Identifiant ou mot de passe incorrect');

    // Ménage : on retire les jetons expirés de cet utilisateur.
    await this.tokens.delete({ userId: user.id, expiresAt: LessThan(new Date()) });
    return this.ouvrir(user, randomUUID(), ctx);
  }

  /** Échange un jeton de rafraîchissement contre une nouvelle paire (rotation). */
  async refresh(refreshToken: string | undefined, ctx: Contexte): Promise<Session> {
    if (!refreshToken) throw new UnauthorizedException('Session expirée');

    const actuel = await this.tokens.findOne({ where: { tokenHash: sha256(refreshToken) } });
    if (!actuel) throw new UnauthorizedException('Session expirée');

    if (actuel.revokedAt) {
      // Jeton déjà utilisé : course légitime entre onglets, ou rejeu d'un jeton volé.
      if (Date.now() - actuel.revokedAt.getTime() > TOLERANCE_REUTILISATION_MS) {
        await this.revoquerFamille(actuel.familleId);
        this.log.warn(`Réutilisation d'un jeton révoqué (utilisateur ${actuel.userId}) : session fermée.`);
      }
      throw new UnauthorizedException('Session expirée');
    }
    if (actuel.expiresAt.getTime() <= Date.now()) throw new UnauthorizedException('Session expirée');

    const user = await this.users.findById(actuel.userId);
    if (!user || !user.actif) {
      await this.revoquerFamille(actuel.familleId);
      throw new UnauthorizedException('Compte désactivé');
    }

    // Révocation atomique : une seule requête concurrente peut consommer ce jeton.
    const res = await this.tokens.update({ id: actuel.id, revokedAt: IsNull() }, { revokedAt: new Date() });
    if (!res.affected) throw new UnauthorizedException('Session expirée');

    return this.ouvrir(user, actuel.familleId, ctx);
  }

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return;
    const actuel = await this.tokens.findOne({ where: { tokenHash: sha256(refreshToken) } });
    if (actuel) await this.revoquerFamille(actuel.familleId);
  }

  private async revoquerFamille(familleId: string) {
    await this.tokens.update({ familleId, revokedAt: IsNull() }, { revokedAt: new Date() });
  }

  private async ouvrir(user: User, familleId: string, ctx: Contexte): Promise<Session> {
    const refreshToken = randomBytes(48).toString('base64url');
    await this.tokens.save(
      this.tokens.create({
        userId: user.id,
        tokenHash: sha256(refreshToken),
        familleId,
        expiresAt: new Date(Date.now() + this.refreshTtl * 1000),
        revokedAt: null,
        userAgent: ctx.userAgent?.slice(0, 255) ?? null,
        ip: ctx.ip?.slice(0, 64) ?? null,
      }),
    );
    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role }, { expiresIn: this.accessTtl });
    return {
      accessToken,
      accessExpiresIn: this.accessTtl,
      refreshToken,
      refreshExpiresIn: this.refreshTtl,
      user: { id: user.id, login: user.login, nom: user.nom, roles: [user.role] },
    };
  }
}
