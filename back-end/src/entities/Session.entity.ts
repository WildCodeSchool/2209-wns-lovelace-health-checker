import { randomBytes } from 'crypto';
import { BeforeInsert, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import User from './User.entity';

@Entity()
export default class Session {
  constructor(user: User) {
    this.user = user;
  }

  @PrimaryColumn("varchar", {
    length: 64,
  })
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @BeforeInsert()
  setId() {
    this.id = randomBytes(32).toString("hex");
  }
}
