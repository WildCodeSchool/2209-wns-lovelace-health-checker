import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { HttpErrorStatusCode } from "../utils/http-error-status-codes.enum";
import RequestSetting from "./RequestSetting.entity";

export enum AlertType {
  PUSH = "push",
  EMAIL = "email",
}

@Entity("alert_setting")
@ObjectType()
export default class AlertSetting {
  constructor(
    requestSetting: RequestSetting,
    httpStatusCode: number,
    type: AlertType
  ) {
    this.requestSetting = requestSetting;
    this.httpStatusCode = httpStatusCode;
    this.type = type;
  }

  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @ManyToOne(() => RequestSetting, (requestSetting) => requestSetting.alerts, {
    onDelete: "CASCADE",
    eager: true,
  })
  @Field(() => RequestSetting)
  requestSetting: RequestSetting;

  @Column({ type: "enum", enum: HttpErrorStatusCode })
  @Field()
  @IsNotEmpty()
  httpStatusCode: HttpErrorStatusCode;

  @Column({ type: "enum", enum: AlertType })
  @Field()
  @IsNotEmpty()
  type: AlertType;

  @Column({ nullable: true, default: null })
  @Field()
  @IsDate()
  preventAlertUntil: Date;

  private static setDurationInMinutesBeforeNextAlert = (
    minutes: number
  ): Date => {
    let now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    now = new Date(now);
    return now;
  };
}
