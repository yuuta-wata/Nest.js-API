import { Field, InputType } from 'type-graphql';
import { User } from '../entity/User.entity';

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;
}
