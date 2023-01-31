import { IsBoolean, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import AlertSetting from "./AlertSetting.entity";
import User from "./User.entity";

export enum Frequency {
  THIRTY_DAYS = 2592000,
  SEVEN_DAYS = 604800,
  ONE_DAY = 86400,
  TWELVE_HOURS = 43200,
  SIX_HOURS = 21600,
  ONE_HOUR = 3600,
  THIRTY_MINUTES = 1800,
  FIFTEEN_MINUTES = 900,
  ONE_MINUTE = 60,
  THIRTY_SECONDS = 30,
  FIFTEEN_SECONDS = 15,
  FIVE_SECONDS = 5,
}

@Entity("request_setting")
@ObjectType()
export default class RequestSetting {
  constructor(
    user: User,
    url: string,
    frequency: number,
    name?: string,
    headers?: string
  ) {
    this.user = user;
    this.frequency = frequency;
    this.url = url;
    this.isActive = true;
    this.name = name;
    this.headers = headers;
  }

  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column()
  @Field()
  @IsString()
  @IsNotEmpty()
  url: string;

  @Column({ type: "enum", enum: Frequency, default: Frequency.ONE_HOUR })
  @Field()
  @IsNotEmpty()
  frequency: Frequency;

  @Column({ default: true })
  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsString()
  @MinLength(1)
  name?: string;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsString()
  headers?: string;

  @OneToMany(
    () => AlertSetting,
    (alertSetting) => alertSetting.requestSetting,
    { eager: true }
  )
  @Field(() => [AlertSetting])
  alerts: AlertSetting[];
}
