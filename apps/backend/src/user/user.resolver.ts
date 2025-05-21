import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { BanUserInput } from './dto/ban-user.input';
import { UnbanUserInput } from './dto/unban-user.input';
import { IsUserBannedInput } from './dto/isbanned-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => String)
  hello(@Context() context: { req: { user: User } }) {
    const user = context.req.user;
    console.log({ user });
    return `User: ${user.id}`;
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  async banUser(@Args('banUserInput') banUserInput: BanUserInput) {
    return await this.userService.banUser(banUserInput);
  }

  @Mutation(() => User)
  async unbanUser(@Args('unbanUserInput') unbanUserInput: UnbanUserInput) {
    return await this.userService.unbanUser(unbanUserInput);
  }

  @Mutation(() => Boolean)
  async isUserBanned(
    @Args('isUserBannedInput') isUserBannedInput: IsUserBannedInput,
  ) {
    return await this.userService.isUserBanned(isUserBannedInput);
  }
}
