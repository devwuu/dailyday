import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'USER',
})
export class User extends CommonEntity {
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true, nullable: false })
  email: string;

  @IsString()
  @Column({ nullable: false, default: 'username' })
  name?: string;

  @Exclude()
  @IsNotEmpty()
  @Column({ nullable: false })
  password: string;
}
