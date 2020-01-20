import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
// DBのテーブル作成
@Entity()
export class User extends BaseEntity {
  // idをDB側で自動生成される主キーとして設定、uuidで保存する
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  userName: string;
  // 列タイプをtextとし、一意であることをtrueにする
  @Column('text', { unique: true })
  email: string;

  @Column()
  password: string;
}
