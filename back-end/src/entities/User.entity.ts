import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import RequestSetting from './RequestSetting.entity';

export enum Status {
  PENDING = "pending",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum Role {
  USER = "user",
  PREMIUM = "premium",
  ADMIN = "admin",
}

@Entity("app_user")
@ObjectType()
export default class User {
  constructor(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }

  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Column()
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  firstname: string;

  @Column()
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  lastname: string;

  @Column()
  @Field()
  @Index({ unique: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 320)
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(8, 120)
  password: string;

  @Column({ default: new Date() })
  @Field()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsDate()
  updatedAt: Date;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsDate()
  lastLoggedAt: Date;

  @Column({ nullable: true, default: null })
  @Index({ unique: true })
  @Field({ nullable: true })
  @IsString()
  customerId: string;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsBoolean()
  hasCanceledPremium: boolean;

  @Column({ type: "enum", enum: Status, default: Status.PENDING })
  @Field()
  @IsNotEmpty()
  status: Status;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  @Field()
  @IsNotEmpty()
  role: Role;

  @Column({ unique: true, nullable: true, default: null })
  @IsString()
  @Length(1, 64)
  confirmationEmailToken: string;

  /*   Use Index() in case where two users have same value here. The first user who confirms got the new email address, so we need to delete all other emailAwaitingConfirmation where value is the same. So, we'll not search by user id, but by user emailAwaitingConfirmation. */
  @Column({ nullable: true, default: null })
  @Index()
  @IsString()
  @IsEmail()
  @Length(1, 320)
  emailAwaitingConfirmation: string;

  @Column({ nullable: true, default: null })
  @IsDate()
  confirmationEmailCreatedAt: Date;

  @Column({ nullable: true, default: null })
  @Index({ unique: true })
  @IsString()
  @Length(1, 64)
  resetPasswordToken: string;

  @Column({ nullable: true, default: null })
  @IsDate()
  resetPasswordTokenCreatedAt: Date;

  @Column({ unique: true, nullable: true, default: null })
  @IsString()
  @Length(1, 64)
  accountConfirmationToken: string;

  @Column({ nullable: true, default: null })
  @IsDate()
  accountConfirmationTokenCreatedAt: Date;

  @OneToMany(() => RequestSetting, (requestSetting) => requestSetting.user)
  @Field(() => [RequestSetting])
  requests: RequestSetting[];
}
