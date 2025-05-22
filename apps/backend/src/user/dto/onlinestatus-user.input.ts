import { InputType } from '@nestjs/graphql';

@InputType()
export class SetOnlineStatusInput {
  userId: number;
  isOnline: boolean;
}
