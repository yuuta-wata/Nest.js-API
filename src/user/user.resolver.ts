import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entity/User.entity';
import { MyContext } from './types/myContext';
import { LoginInput } from './input/login.input';
import { RegisterInput } from './input/register.input';
import { RegisterDto } from './dto/register.dto';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  // 全ユーザー取得
  @Query(() => [RegisterDto])
  async user() {
    return this.userService.findAll();
  }
  // ユーザー登録
  @Mutation(() => RegisterDto)
  async register(@Args('date') input: RegisterInput) {
    return this.userService.register(input);
  }

  // ログイン
  @Mutation(() => [RegisterDto], { nullable: true })
  async login(
    @Args('login') loginInput: LoginInput,
    @Context() ctx: MyContext,
  ): Promise<User | null> {
    return this.userService.login(loginInput, ctx.req);
  }
}
