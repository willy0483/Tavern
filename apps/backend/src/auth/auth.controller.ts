import { AuthService } from './auth.service';
import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req: { user: any }, @Res() res: Response) {
    // Log user data for debugging purposes in non-production environments only.
    // Avoid logging sensitive information in production to ensure user privacy and security.
    // console.log('user: ', req.user);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const userData = await this.authService.login(req.user);
    console.log('Google user data:', req.user);

    res.redirect(
      `http://localhost:3000/api/auth/google/callback?userId=${userData.id}&name=${userData.name}&avatar=${userData.avatar}&accessToken=${userData.accessToken}&refreshToken=${userData.refreshToken}`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  verify() {
    return 'ok';
  }
}
