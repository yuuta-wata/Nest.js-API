import { Field, InputType } from 'type-graphql';

@InputType()
export class inputUser {
  @Field()
  readonly userName: string;

  @Field()
  readonly email: string;

  @Field()
  readonly password: string;
}
