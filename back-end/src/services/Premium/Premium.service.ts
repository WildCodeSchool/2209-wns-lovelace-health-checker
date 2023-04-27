import Premium from "../../entities/Premium.entity";
import PremiumRepository from "../../repositories/Premium.repository";

export default class PremiumService extends PremiumRepository {

  public static getPremiumByUserId = (userId: string): Promise<Premium | null> => {
    return PremiumRepository.getPremiumByUserId(userId);
  };
}
