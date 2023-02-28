import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";
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
    isActive: boolean,
    name?: string,
    headers?: string
  ) {
    this.user = user;
    this.frequency = frequency;
    this.url = url;
    this.isActive = isActive;
    this.name = name;
    this.headers = headers;
    this.createdAt = new Date();
  }

  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Column()
  @Field()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
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

  @Column()
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
    { lazy: true, onDelete: "CASCADE" }
  )
  @Field(() => [AlertSetting])
  alerts: AlertSetting[];
}
