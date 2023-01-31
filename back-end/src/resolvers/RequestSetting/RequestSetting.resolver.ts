import { Args, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { GlobalContext } from "../..";
import { AlertType } from "../../entities/AlertSetting.entity";
import RequestResult from "../../entities/RequestResult.entity";
import RequestSetting from "../../entities/RequestSetting.entity";
import User from "../../entities/User.entity";
import AlertSettingRepository from "../../repositories/AlertSetting.repository";
import RequestSettingRepository from "../../repositories/RequestSetting.repository";
import AlertSettingService from "../../services/AlertSetting.service";
import RequestSettingService from "../../services/RequestSetting.service";
import UserService from "../../services/User.service";
import { HttpErrorStatusCode } from "../../utils/http-error-status-codes.enum";
import { CreateRequestSettingArgs } from "./RequestSetting.input";

@Resolver(RequestSetting)
export default class RequestSettingResolver {
  // @Ctx() context: GlobalContext
  //@Authorized()
  @Mutation(() => RequestSetting)
  async create(
    @Args()
    {
      url,
      frequency,
      name,
      headers,
      allErrorsEnabledEmail,
      allErrorsEnabledPush,
      customEmailErrors,
      customPushErrors,
    }: CreateRequestSettingArgs
  ): Promise<RequestSetting> {
    /*     const user = context.user as User;
    if (!user) throw Error("Unable to find user from global context"); */

    // Only for test purposes
    const dummyUser = await UserService.findByEmail("vianneyaccart@gmail.com");

    const createdRequestSetting =
      await RequestSettingService.createRequestSetting(
        dummyUser!,
        url,
        frequency,
        name,
        headers
      );

    // Changer le libellé de l'erreur
    if (!createdRequestSetting)
      throw Error("Unable to retrieve request result");

    // Si création requete OK, alors création des alertes
    await setPushAlerts(
      customPushErrors,
      allErrorsEnabledPush,
      createdRequestSetting
    );

    await setEmailAlerts(
      customEmailErrors,
      allErrorsEnabledEmail,
      createdRequestSetting
    );

    const alerts = await AlertSettingRepository.getAlertsByRequestSettingId(
      createdRequestSetting.id
    );

    console.log("alerts", alerts); // EMPTY

    createdRequestSetting.alerts = alerts;

    const result = await RequestSettingService.saveUpdatedRequestSetting(
      createdRequestSetting
    );

    return result;
  }
}

async function setPushAlerts(
  customPushErrors: number[] | undefined,
  allErrorsEnabledPush: boolean,
  createdRequestSetting: RequestSetting
) {
  if (customPushErrors && customPushErrors.length) {
    customPushErrors.forEach(async (httpErrorStatusCode) => {
      await AlertSettingService.createAlertSetting(
        httpErrorStatusCode,
        createdRequestSetting,
        AlertType.PUSH
      );
    });
  } else if (allErrorsEnabledPush) {
    for (const httpErrorStatusCode in HttpErrorStatusCode) {
      if (!isNaN(Number(httpErrorStatusCode))) {
        await AlertSettingService.createAlertSetting(
          parseInt(httpErrorStatusCode),
          createdRequestSetting,
          AlertType.PUSH
        );
      }
    }
  }
}

async function setEmailAlerts(
  customEmailErrors: number[] | undefined,
  allErrorsEnabledEmail: boolean,
  createdRequestSetting: RequestSetting
) {
  if (customEmailErrors && customEmailErrors.length) {
    customEmailErrors.forEach(async (httpErrorStatusCode) => {
      await AlertSettingService.createAlertSetting(
        httpErrorStatusCode,
        createdRequestSetting,
        AlertType.EMAIL
      );
    });
  } else if (allErrorsEnabledEmail) {
    for (const httpErrorStatusCode in HttpErrorStatusCode) {
      if (!isNaN(Number(httpErrorStatusCode))) {
        await AlertSettingService.createAlertSetting(
          parseInt(httpErrorStatusCode),
          createdRequestSetting,
          AlertType.EMAIL
        );
      }
    }
  }
}
