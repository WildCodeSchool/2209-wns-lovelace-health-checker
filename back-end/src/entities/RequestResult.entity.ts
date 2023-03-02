import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import RequestSetting from "./RequestSetting.entity";

@Entity("request_result")
@ObjectType()
export default class RequestResult {
  constructor(
    requestSetting: RequestSetting,
    statusCode?: number,
    duration?: number
  ) {
    this.requestSetting = requestSetting;
    this.statusCode = statusCode || undefined;
    this.duration = duration || undefined;
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

  @ManyToOne(() => RequestSetting)
  @Field(() => RequestSetting)
  requestSetting: RequestSetting;

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
