import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/signin.input';
import { AuthPayload } from './entities/auth-payload.entity';
import { ForbiddenException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signIn(@Args('signInInput') signInInput: SignInInput) {
    const user = await this.authService.validateLocalUser(signInInput);
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    return await this.authService.login(user);
  }

  @Mutation(() => String)
  async refreshAccessToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<string> {
    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);
    return accessToken;
  }
}
