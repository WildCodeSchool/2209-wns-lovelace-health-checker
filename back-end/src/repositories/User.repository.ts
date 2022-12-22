import { Repository } from 'typeorm';

import { getRepository } from '../database/utils';
import User from '../entities/User.entity';

export default class UserRepository {
  static repository: Repository<User>;
  static async initializeRepository() {
    this.repository = await getRepository(User);
  }

  protected static saveUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  protected static findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  static async clearRepository(): Promise<void> {
    this.repository.delete({});
  }

  protected static getUserByAccountConfirmationToken = async (
    token: string
  ): Promise<User | null> => {
    return this.repository.findOneBy({ accountConfirmationToken: token });
  };

  protected static getUserByResetPasswordToken = async (
    token: string
  ): Promise<User | null> => {
    return this.repository.findOneBy({ resetPasswordToken: token });
  };
}
