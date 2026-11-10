import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres' as const,
        host: cfg.get<string>('DB_HOST', 'localhost'),
        port: Number(cfg.get('DB_PORT', 5432)),
        username: cfg.get<string>('DB_USER', 'schoolflow'),
        password: cfg.getOrThrow<string>('DB_PASSWORD'),
        database: cfg.get<string>('DB_NAME', 'schoolflow'),
        entities: [User],
        // Premier jalon : le schéma est créé automatiquement. À remplacer par des migrations
        // dès que le modèle (élèves, classes…) sera en place.
        synchronize: cfg.get('DB_SYNC', 'true') === 'true',
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
