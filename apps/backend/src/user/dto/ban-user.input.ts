import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class BanUserInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  minutes?: number;
}
