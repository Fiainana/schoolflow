import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { LoginDto } from './login.dto';
import { COOKIE_NAME, JwtGuard } from './jwt.guard';

const DUREE_SECONDES = 8 * 3600;
// Hash factice : le temps de réponse reste le même quand le login n'existe pas.
const FAUX_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO5GmCJbCSjXzdHqkVZqS8VqTf2dQ1q6e';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.users.findByLogin(dto.login);
    const ok = await bcrypt.compare(dto.password, user?.passwordHash ?? FAUX_HASH);
    if (!user || !user.actif || !ok) throw new UnauthorizedException('Identifiant ou mot de passe incorrect');

    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role }, { expiresIn: DUREE_SECONDES });
    res.cookie(COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      maxAge: DUREE_SECONDES * 1000,
      path: '/',
    });
    return { success: true, data: { accessToken, expiresIn: DUREE_SECONDES, user: this.profil(user) } };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@Req() req: Request & { user: { sub: number } }) {
    const user = await this.users.findById(req.user.sub);
    if (!user || !user.actif) throw new UnauthorizedException('Compte désactivé');
    return { success: true, data: this.profil(user) };
  }

  private profil(u: { id: number; login: string; nom: string; role: string }) {
    return { id: u.id, login: u.login, nom: u.nom, roles: [u.role] };
  }
}
