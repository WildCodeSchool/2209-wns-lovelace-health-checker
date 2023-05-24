import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import RequestSetting from "./RequestSetting.entity";

@Entity("request_result")
@ObjectType()
export default class RequestResult {
  constructor(
    requestSetting: RequestSetting,
    url: string,
    headers?: string,
    statusCode?: number,
    duration?: number
  ) {
    this.requestSetting = requestSetting;
    this.url = url;
    this.statusCode = statusCode ?? undefined;
    this.duration = duration ?? undefined;
    this.headers = headers ?? undefined;
    this.createdAt = new Date();
  }

  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsNumber()
  statusCode?: number;

  @Column()
  @Field()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsNumber()
  duration?: number;

  @ManyToOne(() => RequestSetting, (requestSetting) => requestSetting.results, {
    onDelete: "CASCADE",
  })
  @Field(() => RequestSetting)
  requestSetting: RequestSetting;

  @OneToMany(
    () => RequestResult,
    (requestResult) => requestResult.requestSetting,
    { lazy: true }
  )
  @Field(() => [RequestResult])
  alerts: RequestResult[];

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsString()
  headers?: string;

  @Column()
  @Field()
  @IsString()
  @IsNotEmpty()
  url: string;

  @Field(() => Boolean)
  getIsAvailable() {
    switch (this.statusCode?.toString().charAt(0)) {
      case "1":
      case "2":
      case "3":
        return true;
      case "4":
      case "5":
      default:
        return false;
    }
  }
}
