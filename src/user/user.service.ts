import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { inputUser } from './input/user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  // ユーザーを作成するメソッド
  async createUser(date: inputUser): Promise<User> {
    // インスタンス作成
    const createdUser = new User();
    createdUser.userName = date.userName;
    createdUser.email = date.email;
    createdUser.password = await bcrypt.hash(date.password, 12);

    await this.userRepository.save(createdUser);

    return createdUser;
  }
  //　全ユーザーを取得するメソッド
  async findAll() {
    return await this.userRepository.find();
  }
}
