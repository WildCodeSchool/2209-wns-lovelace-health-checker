import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import User from './User.entity';

@Entity()
@ObjectType()
export default class Premium {
  constructor(
    startDate: Date,
    endDate: Date,
    billingType: string,
    price: number
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.billingType = billingType;
    this.price = price;
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
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Column()
  @Field()
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @Column()
  @Field()
  @IsString()
  @IsNotEmpty()
  billingType: string;

  @Column({ type: "float" })
  @Field()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
