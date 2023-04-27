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
import RequestResult from "./RequestResult.entity";

export enum Frequency {
  FIVE_SECONDS = 5,
  FIFTEEN_SECONDS = 15,
  THIRTY_SECONDS = 30,
  ONE_MINUTE = 60,
  FIFTEEN_MINUTES = 900,
  THIRTY_MINUTES = 1800,
  ONE_HOUR = 3600,
  SIX_HOURS = 21600,
  TWELVE_HOURS = 43200,
  ONE_DAY = 86400,
  SEVEN_DAYS = 604800,
  THIRTY_DAYS = 2592000,
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

  @Column({ type: "int", enum: Frequency, default: Frequency.ONE_HOUR })
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
    { lazy: true }
  )
  @Field(() => [AlertSetting])
  alerts: AlertSetting[];

  @OneToMany(
    () => RequestResult,
    (requestResult) => requestResult.requestSetting,
    { lazy: true }
  )
  @Field(() => [RequestResult])
  results: RequestResult[];

  isRequestPremium(): boolean {
    const premiumFrequencies: Frequency[] = [
      Frequency.FIVE_SECONDS,
      Frequency.FIFTEEN_SECONDS,
      Frequency.THIRTY_SECONDS,
      Frequency.ONE_MINUTE,
      Frequency.FIFTEEN_MINUTES,
      Frequency.THIRTY_MINUTES,
    ];
    if (premiumFrequencies.includes(this.frequency)) {
      return true;
    }
    return false;
  }
}
