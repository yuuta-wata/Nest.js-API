import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginInput } from './input/login.input';
import { RegisterInput } from './input/register.input';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  //　全ユーザーを取得するメソッド
  async findAll() {
    return await this.userRepository.find();
  }

  // 非同期処理でユーザーを登録するregisterメソッドを作成、入力タイプはRegisterInputから受け取ってる
  async register({ userName, email, password }: RegisterInput): Promise<User> {
    // ハッシュ関数を生成
    const hashedPassword = await bcrypt.hash(password, 12);
    // ユーザーを作成する、passwordの型にhashedPasswordを設定することで、ハッシュ化している
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    }).save();
    // UserEntityに返し、DBに保存
    return user;
  }

  // ログインメソッド
  async login(loginInput: LoginInput, req: Request): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: loginInput.email },
    });
    // 登録ユーザーが存在しない場合はnullを返す
    if (!user) {
      return null;
    }
    // 登録してるハッシュパスワードと一致するか確かめる
    const valid = await bcrypt.compare(loginInput.password, user.password);
    // パスワードが一致しない場合はnullを返す
    if (!valid) {
      return null;
    }
    // emailとpasswordが一致したらリクエストセッションを行い、ログイン
    req.session!.userId = user.id;

    return user;
  }
}
