import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService, Contexte, Session } from './auth.service';
import { LoginDto } from './login.dto';
import { COOKIE_NAME, JwtGuard } from './jwt.guard';

export const REFRESH_COOKIE = 'schoolflow_refresh';
/** Le jeton de rafraîchissement n'est envoyé qu'aux routes d'authentification. */
const REFRESH_PATH = '/api/auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const session = await this.auth.login(dto.login, dto.password, this.contexte(req));
    return this.repondre(res, session);
  }

  /** Jeton lu dans le cookie httpOnly, ou dans le corps `{ refreshToken }` pour un client non navigateur. */
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: { refreshToken?: string }, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const jeton = req.cookies?.[REFRESH_COOKIE] ?? body?.refreshToken;
    try {
      const session = await this.auth.refresh(jeton, this.contexte(req));
      return this.repondre(res, session);
    } catch (e) {
      this.effacerCookies(res);
      throw e;
    }
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Body() body: { refreshToken?: string }, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(req.cookies?.[REFRESH_COOKIE] ?? body?.refreshToken);
    this.effacerCookies(res);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@Req() req: Request & { user: { sub: number } }) {
    const user = await this.users.findById(req.user.sub);
    if (!user || !user.actif) throw new UnauthorizedException('Compte désactivé');
    return { success: true, data: { id: user.id, login: user.login, nom: user.nom, roles: [user.role] } };
  }

  private repondre(res: Response, s: Session) {
    const secure = process.env.COOKIE_SECURE === 'true';
    res.cookie(COOKIE_NAME, s.accessToken, { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: s.accessExpiresIn * 1000 });
    res.cookie(REFRESH_COOKIE, s.refreshToken, { httpOnly: true, sameSite: 'lax', secure, path: REFRESH_PATH, maxAge: s.refreshExpiresIn * 1000 });
    return {
      success: true,
      data: {
        accessToken: s.accessToken,
        tokenType: 'Bearer',
        expiresIn: s.accessExpiresIn,
        refreshToken: s.refreshToken,
        refreshExpiresIn: s.refreshExpiresIn,
        user: s.user,
      },
    };
  }

  private effacerCookies(res: Response) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.clearCookie(REFRESH_COOKIE, { path: REFRESH_PATH });
  }

  private contexte(req: Request): Contexte {
    return { userAgent: req.headers['user-agent'], ip: req.ip };
  }
}
