import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/CommonEntity';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'USER',
})
export class User extends CommonEntity {
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true, nullable: false })
  email: string;

  @IsNotEmpty()
  @Exclude()
  @Column({ nullable: false })
  password: string;
}
