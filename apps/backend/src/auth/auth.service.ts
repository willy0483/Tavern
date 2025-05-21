import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInInput } from './dto/signin.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { User } from '@prisma/client';
import { CreateUserInput } from 'src/user/dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateLocalUser({ email, password }: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('User Not Found');
    if (!user.password) throw new UnauthorizedException('Invalid credentials');

    const passwordMatched = await verify(user.password, password);

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    return user;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload: AuthJwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.REFRESH_JWT_SECRET,
        },
      );
      const accessToken = await this.generateAccessToken(payload.sub);

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateAccessToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPRIES_IN,
      secret: process.env.JWT_SECRET,
    });
    return accessToken;
  }

  async generateToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPRIES_IN,
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.REFRESH_JWT_EXPRIES_IN,
      secret: process.env.REFRESH_JWT_SECRET,
    });
    return { accessToken, refreshToken };
  }

  async login(user: User) {
    const { accessToken, refreshToken } = await this.generateToken(user.id);
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new UnauthorizedException('User not found!');

    const currentUser = { id: user.id };
    return currentUser;
  }

  async validateGoogleUser(googleUser: CreateUserInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    if (user) {
      const { ...authUser } = user;
      return authUser;
    }

    const dbUser = await this.prisma.user.create({
      data: {
        ...googleUser,
      },
    });

    const { ...authUser } = dbUser;
    return authUser;
  }
}
