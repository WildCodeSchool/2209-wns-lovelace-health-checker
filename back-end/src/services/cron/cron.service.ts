import { CronJob } from "cron";
import RequestSetting, {
  Frequency,
} from "../../entities/RequestSetting.entity";
import { sendMessageOnAutomatedRequestQueue } from "../../rabbitmq/providers";
import RequestSettingService from "../RequestSetting/RequestSetting.service";

// Should sort on this order : admin, premium, user
const compareRequestSettingsByUserRole = (
  a: RequestSetting,
  b: RequestSetting
) => (a.user.role > b.user.role ? 1 : b.user.role > a.user.role ? -1 : 0);

const sendMessageByFrequency = async (
  frequency: Frequency,
  isPremiumRequest: boolean
): Promise<void> => {
  const requestSettings: RequestSetting[] =
    await RequestSettingService.getRequestSettingsByFrequency(frequency);
  if (requestSettings.length) {
    if (!isPremiumRequest) {
      requestSettings.sort(compareRequestSettingsByUserRole);
    }
    for (const requestSetting of requestSettings) {
      sendMessageOnAutomatedRequestQueue(requestSetting);
    }
  }
};

// more info here : https://github.com/kelektiv/node-cron#api
// cron every 5 secondes at **:**:*0 and **:**:*5
const fiveSecondsJob = new CronJob("*/5 * * * * *", async () => {
  sendMessageByFrequency(Frequency.FIVE_SECONDS, true);
});

// cron every 15 secondes at **:**:00, **:**:15, **:**:30, **:**:45
const fifteenSecondsJob = new CronJob("*/15 * * * * *", async () => {
  sendMessageByFrequency(Frequency.FIFTEEN_SECONDS, true);
});

// cron every 30 secondes at **:**:00, **:**:30
const thirtySecondsJob = new CronJob("*/30 * * * * *", async () => {
  sendMessageByFrequency(Frequency.THIRTY_SECONDS, true);
});

// cron every minute at **:**:00
const oneMinuteJob = new CronJob("0 * * * * *", async () => {
  sendMessageByFrequency(Frequency.ONE_MINUTE, true);
});

// cron every 15 minutes at **:00:00, **:15:00, **:30:00, **:45:00
const fifteenMinuteJob = new CronJob("0 */15 * * * *", async () => {
  sendMessageByFrequency(Frequency.FIFTEEN_MINUTES, true);
});

// cron every 30 minutes at **:00:00, **:30:00
const thirtyMinutesJob = new CronJob("0 */30 * * * *", async () => {
  sendMessageByFrequency(Frequency.THIRTY_MINUTES, true);
});

// cron every hour at **:00:00
const hourlyJob = new CronJob("0 0 * * * *", async () => {
  sendMessageByFrequency(Frequency.ONE_HOUR, false);
});

// cron 6 hours at 00:00:00, 06:00:00, 12:00:00, 18:00:00
const sixHoursJob = new CronJob("0 0 */6 * * *", async () => {
  sendMessageByFrequency(Frequency.SIX_HOURS, false);
});

// cron every 12 hours at 00:00:00 and 12:00:00
const twelveHoursJob = new CronJob("0 0 */12 * * *", async () => {
  sendMessageByFrequency(Frequency.TWELVE_HOURS, false);
});

// cron every day at 00:00:00
const dailyJob = new CronJob("0 0 0 * * *", async () => {
  sendMessageByFrequency(Frequency.ONE_DAY, false);
});

// cron every week at sunday 00:00:00
const weeklyJob = new CronJob("0 0 0 * * sun", async () => {
  sendMessageByFrequency(Frequency.SEVEN_DAYS, false);
});

// cron every 1st of the month at 00:00:00
const monthlyJob = new CronJob("0 0 0 1 * *", async () => {
  sendMessageByFrequency(Frequency.THIRTY_DAYS, false);
});

export const startCrons = (): void => {
  fiveSecondsJob.start();
  fifteenSecondsJob.start();
  thirtySecondsJob.start();
  oneMinuteJob.start();
  fifteenMinuteJob.start();
  thirtyMinutesJob.start();
  hourlyJob.start();
  sixHoursJob.start();
  twelveHoursJob.start();
  dailyJob.start();
  weeklyJob.start();
  monthlyJob.start();
};
