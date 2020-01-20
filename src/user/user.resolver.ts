import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { inputUser } from './input/user.input';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [CreateUserDto])
  async user() {
    return this.userService.findAll();
  }

  @Mutation(() => CreateUserDto)
  async createUser(@Args('date') input: inputUser) {
    return this.userService.createUser(input);
  }
}
