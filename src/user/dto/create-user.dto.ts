import { Field, ObjectType, ID } from 'type-graphql';
// データ転送オブジェクト
@ObjectType()
export class CreateUserDto {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly userName: string;

  @Field()
  readonly email: string;

  @Field()
  readonly password: string;
}
