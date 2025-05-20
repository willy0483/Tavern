import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UnbanUserInput {
  @Field(() => Int)
  userId: number;
}
