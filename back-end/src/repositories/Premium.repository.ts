import { Repository } from "typeorm";

import { getRepository } from "../database/utils";
import Premium from "../entities/Premium.entity";

export default class PremiumRepository {
  protected static repository: Repository<Premium>;

  static async initializeRepository() {
    this.repository = await getRepository(Premium);
  }

  protected static savePremium(premium: Premium): Promise<Premium> {
    return this.repository.save(premium);
  }

  static async clearRepository(): Promise<void> {
    await this.repository.delete({});
  }
}
