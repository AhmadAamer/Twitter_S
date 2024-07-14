import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ResponseType<T> {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  message?: string;

  // @Field(() => T, { nullable: true })
  data?: T;
}
