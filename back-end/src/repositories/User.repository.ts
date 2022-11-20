import { Repository } from 'typeorm';

import { getRepository } from '../database/utils';
import User from '../entities/User.entity';

export default class UserRepository {
  protected static repository: Repository<User>;
  static async initializeRepository() {
    this.repository = await getRepository(User);
  }

  protected static saveUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  protected static findByEmailAddress(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  static async clearRepository(): Promise<void> {
    this.repository.delete({});
  }
}
