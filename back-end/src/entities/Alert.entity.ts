import { IsBoolean, IsDate, IsNotEmpty, IsString } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import RequestResult from "./RequestResult.entity";

@Entity()
@ObjectType()
export default class Alert {
  constructor(requestResult: RequestResult) {
    this.requestResult = requestResult;
    this.createdAt = new Date();
  }

  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsBoolean()
  isEmailSent: boolean;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsBoolean()
  isPushSent: boolean;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsBoolean()
  isRead: boolean;

  @Column()
  @Field()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsDate()
  emailSentAt: Date;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  @IsDate()
  pushSentAt: Date;

  @ManyToOne(() => RequestResult, { onDelete: "CASCADE" })
  @Field(() => RequestResult)
  requestResult: RequestResult;
}
