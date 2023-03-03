export enum Frequency {
  THIRTY_DAYS = 2592000,
  SEVEN_DAYS = 604800,
  ONE_DAY = 86400,
  TWELVE_HOURS = 43200,
  SIX_HOURS = 21600,
  ONE_HOUR = 3600,
  THIRTY_MINUTES = 1800,
  FIFTEEN_MINUTES = 900,
  ONE_MINUTE = 60,
  THIRTY_SECONDS = 30,
  FIFTEEN_SECONDS = 15,
  FIVE_SECONDS = 5,
}

export const formatFrequency = (frequency: number): string => {
  if (frequency >= 2592000) {
    const numMonths = Math.round(frequency / 2592000);
    return `${numMonths} ${numMonths > 1 ? "months" : "month"}`;
  } else if (frequency >= 86400) {
    const numDays = Math.round(frequency / 86400);
    return `${numDays} ${numDays > 1 ? "days" : "day"}`;
  } else if (frequency >= 3600) {
    const numHours = Math.round(frequency / 3600);
    return `${numHours} ${numHours > 1 ? "hrs" : "hr"}`;
  } else if (frequency >= 60) {
    const numMinutes = Math.round(frequency / 60);
    return `${numMinutes} ${numMinutes > 1 ? "mins" : "min"}`;
  } else {
    return `${frequency} ${frequency > 1 ? "secs" : "sec"}`;
  }
};

export const parseTimeString = (timeString: string): number => {
  if (typeof timeString !== "string") {
    timeString = formatFrequency(timeString);
  }
  const [valueString, unitString] = timeString.split(" ");
  const value = parseInt(valueString);

  switch (unitString) {
    case "sec":
    case "secs":
      return value;
    case "min":
    case "mins":
      return value * 60;
    case "hr":
    case "hrs":
      return value * 60 * 60;
    case "day":
    case "days":
      return value * 60 * 60 * 24;
    default:
      throw new Error(`Invalid time unit: ${unitString}`);
  }
};
