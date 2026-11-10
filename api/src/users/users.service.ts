import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly log = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly cfg: ConfigService,
  ) {}

  /** Crée le premier administrateur depuis ADMIN_LOGIN / ADMIN_PASSWORD si la table est vide. */
  async onModuleInit() {
    if ((await this.repo.count()) > 0) return;
    const login = this.cfg.get<string>('ADMIN_LOGIN');
    const password = this.cfg.get<string>('ADMIN_PASSWORD');
    if (!login || !password) {
      this.log.warn('Aucun utilisateur et ADMIN_LOGIN/ADMIN_PASSWORD absents : aucun compte créé.');
      return;
    }
    await this.repo.save(
      this.repo.create({
        login: login.trim().toLowerCase(),
        nom: this.cfg.get<string>('ADMIN_NOM', 'Administrateur'),
        passwordHash: await bcrypt.hash(password, 12),
        role: 'Admin',
      }),
    );
    this.log.log(`Administrateur "${login}" créé.`);
  }

  findByLogin(login: string) {
    return this.repo.findOne({ where: { login: login.trim().toLowerCase() } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
