import { CronJob } from "cron";
import RequestSetting, {
  Frequency,
} from "../../entities/RequestSetting.entity";
import { sendMessageOnAutomatedRequestQueue } from "../../rabbitmq/providers";
import RequestSettingService from "../RequestSetting/RequestSetting.service";

// more info here : https://github.com/kelektiv/node-cron#api
// cron every 5 secondes at **:**:*0 and **:**:*5
export const fiveSecondsJob = new CronJob("*/5 * * * * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.FIVE_SECONDS
    );
  if (requestSettings.length) {
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// cron every 15 secondes at **:**:00, **:**:15, **:**:30, **:**:45
export const fifteenSecondsJob = new CronJob("*/15 * * * * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.FIFTEEN_SECONDS
    );
  if (requestSettings.length) {
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// cron every 30 secondes at **:**:00, **:**:30
export const thirtySecondsJob = new CronJob("*/30 * * * * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.THIRTY_SECONDS
    );
  if (requestSettings.length) {
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// cron every minute at **:**:00
export const oneMinuteJob = new CronJob("0 * * * * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.ONE_MINUTE
    );
  if (requestSettings.length) {
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// cron every 15 minutes at **:00:00, **:15:00, **:30:00, **:45:00
export const fifteenMinuteJob = new CronJob("0 */15 * * * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.FIFTEEN_MINUTES
    );
  if (requestSettings.length) {
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// cron every 30 minutes at **:00:00, **:30:00
export const thirtyMinutesJob = new CronJob("0 */30 * * * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.THIRTY_MINUTES
    );
  if (requestSettings.length) {
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// Should sort on this order : admin, premium, user
const compareRequestSettingsByUserRole = (
  a: RequestSetting,
  b: RequestSetting
) => (a.user.role > b.user.role ? 1 : b.user.role > a.user.role ? -1 : 0);

// cron every hour at **:00:00
export const hourlyJob = new CronJob("0 0 * * * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.ONE_HOUR
    );
  if (requestSettings.length) {
    requestSettings.sort(compareRequestSettingsByUserRole);
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// cron 6 hours at 00:00:00, 06:00:00, 12:00:00, 18:00:00
export const sixHoursJob = new CronJob("0 0 */6 * * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.SIX_HOURS
    );
  if (requestSettings.length) {
    requestSettings.sort(compareRequestSettingsByUserRole);
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// cron every 12 hours at 00:00:00 and 12:00:00
export const twelveHoursJob = new CronJob("0 0 */12 * * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.TWELVE_HOURS
    );
  if (requestSettings.length) {
    requestSettings.sort(compareRequestSettingsByUserRole);
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// cron every day at 00:00:00
export const dailyJob = new CronJob("0 0 0 * * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.ONE_DAY
    );
  if (requestSettings.length) {
    requestSettings.sort(compareRequestSettingsByUserRole);
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// cron every week at sunday 00:00:00
export const weeklyJob = new CronJob("0 0 0 * * sun", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.SEVEN_DAYS
    );
  if (requestSettings.length) {
    requestSettings.sort(compareRequestSettingsByUserRole);
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});

// cron every 1st of the month at 00:00:00
export const monthlyJob = new CronJob("0 0 0 1 * *", async () => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(
      Frequency.THIRTY_DAYS
    );
  if (requestSettings.length) {
    requestSettings.sort(compareRequestSettingsByUserRole);
    requestSettings.forEach((requestSetting) =>
      sendMessageOnAutomatedRequestQueue(requestSetting)
    );
  }
});
