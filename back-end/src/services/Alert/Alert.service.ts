import Alert from "../../entities/Alert.entity";
import RequestResult from "../../entities/RequestResult.entity";
import AlertRepository from "../../repositories/Alert.repository";

export default class AlertService extends AlertRepository {
  static async createAlert(requestResult: RequestResult): Promise<Alert> {
    const alert = new Alert(requestResult);
    return await this.saveAlert(alert);
  }

  static async updateAlert(alert: Alert): Promise<Alert> {
    return await this.saveAlert(alert);
  }

  static findAlertByRequestResultId(
    requestResultId: string
  ): Promise<Alert | null> {
    return AlertRepository.findAlertByRequestResultId(requestResultId);
  }
}
