// const CronJob = require("cron").CronJob;

import { CronJob } from "cron";

// more info here : https://github.com/kelektiv/node-cron#api
// cron every 5 secondes at **:**:*0 and **:**:*5
export const fiveSecondsJob = new CronJob("*/5 * * * * *", function () {
  console.log("5 seconds");
});

// cron every 15 secondes at **:**:00, **:**:15, **:**:30, **:**:45
export const fifteenSecondsJob = new CronJob("*/15 * * * * *", function () {
  console.log("15 seconds");
});

// cron every 30 secondes at **:**:00, **:**:30
export const thirtySecondsJob = new CronJob("*/30 * * * * *", function () {
  console.log("30 seconds");
});

// cron every minute at **:**:00
export const oneMinuteJob = new CronJob("0 * * * * *", function () {
  console.log("1 minute");
});

// cron every 15 minutes at **:00:00, **:15:00, **:30:00, **:45:00
export const fifteenMinuteJob = new CronJob("0 */15 * * * *", function () {
  console.log("15 minutes");
});

// cron every 30 minutes at **:00:00, **:30:00
export const thirtyMinutesJob = new CronJob("0 */30 * * * *", function () {
  console.log("30 minutes");
});

// cron every hour at **:00:00
export const hourlyJob = new CronJob("0 0 * * * *", function () {
  console.log("1 hour");
});

// cron 6 hours at 00:00:00, 06:00:00, 12:00:00, 18:00:00
export const sixHoursJob = new CronJob("0 0 */6 * * *", function () {
  console.log("6 hours");
});

// cron every 12 hours at 00:00:00 and 12:00:00
export const twelveHoursJob = new CronJob("0 0 */12 * * *", function () {
  console.log("12 hours");
});

// cron every day at 00:00:00
export const dailyJob = new CronJob("0 0 0 * * *", function () {
  console.log("daily");
});

// cron every week at sunday 00:00:00
export const weeklyJob = new CronJob("0 0 0 * * sun", function () {
  console.log("weekly");
});

// cron every 1st of the month at 00:00:00
export const monthlyJob = new CronJob("0 0 0 1 * *", function () {
  console.log("monthly");
});
