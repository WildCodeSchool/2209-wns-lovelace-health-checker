import { Repository } from "typeorm";

import { getRepository } from "../database/utils";
import Session from "../entities/Session.entity";
import User from "../entities/User.entity";

export default class SessionRepository {
  protected static repository: Repository<Session>;

  static async initializeRepository() {
    this.repository = await getRepository(Session);
  }

  protected static saveSession(session: Session): Promise<Session> {
    return this.repository.save(session);
  }

  static findById(id: string): Promise<Session | null> {
    return this.repository.findOneBy({ id });
  }

  static findByUser(user: User): Promise<Session[] | null> {
    return this.repository.find({ where: { user: { id: user.id } } });
  }

  static async clearRepository(): Promise<void> {
    await this.repository.delete({});
  }

  static async deleteSession(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  static async deleteSessions(sessions: Session[]): Promise<void> {
    await this.repository.remove(sessions);
  }
}
