import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import RequestSetting from './RequestSetting.entity';

@Entity("request_result")
@ObjectType()
export default class RequestResult {
  constructor(
    requestSetting: RequestSetting,
    statusCode: number,
    duration: number
  ) {
    this.requestSetting = requestSetting;
    this.statusCode = statusCode;
    this.duration = duration;
    this.createdAt = new Date();
  }

  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Column()
  @Field()
  @IsNotEmpty()
  @IsNumber()
  statusCode: number;

  @Column()
  @Field()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Column()
  @Field()
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ManyToOne(() => RequestSetting)
  @Field(() => RequestSetting)
  requestSetting: RequestSetting;
}
