import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/User.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { LoginInput } from './input/login.input';
import { RegisterInput } from './input/register.input';
import { MyContext } from './types/myContext';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  //　全ユーザーを取得するメソッド
  async findAll() {
    return await this.userRepository.find();
  }

  // ログインユーザー
  async me(ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }
    console.log(ctx.req.session!.userId);
    return this.userRepository.findOne(ctx.req.session!.userId);
  }

  // ユーザー登録
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

  // ログイン
  async login(loginInput: LoginInput, ctx: MyContext): Promise<User | null> {
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
    ctx.req.session!.userId = user.id;

    return user;
  }
}
