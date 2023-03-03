import { AlertSetting } from "../gql/graphql";
import { AlertType } from "./alert-types.enum";

export enum HttpErrorStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED_REQUEST = 421,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}

export const HTTP_ERROR_STATUS_CODES = [
  { value: 400, label: "400" },
  { value: 401, label: "401" },
  { value: 402, label: "402" },
  { value: 403, label: "403" },
  { value: 404, label: "404" },
  { value: 405, label: "405" },
  { value: 406, label: "406" },
  { value: 407, label: "407" },
  { value: 408, label: "408" },
  { value: 409, label: "409" },
  { value: 410, label: "410" },
  { value: 411, label: "411" },
  { value: 412, label: "412" },
  { value: 413, label: "413" },
  { value: 414, label: "414" },
  { value: 415, label: "415" },
  { value: 416, label: "416" },
  { value: 417, label: "417" },
  { value: 418, label: "418" },
  { value: 421, label: "421" },
  { value: 422, label: "422" },
  { value: 423, label: "423" },
  { value: 424, label: "424" },
  { value: 426, label: "426" },
  { value: 428, label: "428" },
  { value: 429, label: "429" },
  { value: 431, label: "431" },
  { value: 451, label: "451" },
  { value: 500, label: "500" },
  { value: 501, label: "501" },
  { value: 502, label: "502" },
  { value: 503, label: "503" },
  { value: 504, label: "504" },
  { value: 505, label: "505" },
  { value: 506, label: "506" },
  { value: 507, label: "507" },
  { value: 508, label: "508" },
  { value: 510, label: "510" },
  { value: 511, label: "511" },
];

export const getSpecificErrorsByType = (
  type: AlertType,
  alertSettings: any[]
) => {
  return alertSettings.filter((alertSetting: any) => {
    return alertSetting.type === type;
  });
};

export const retrieveExistingSpecificErrors = (alerts: any[]) => {
  let errors: any[] = [];
  alerts.forEach((alert: any) => {
    errors.push({
      value: alert.httpStatusCode,
      label: alert.httpStatusCode.toString(),
    });
  });
  return errors;
};

export const getSpecificErrorsCodes = (alerts: AlertSetting[]) => {
  if (alerts.length !== HTTP_ERROR_STATUS_CODES.length) {
    let errors: number[] = [];
    alerts.forEach((alert: AlertSetting) => {
      errors.push(alert.httpStatusCode);
    });
    return errors;
  }
  return [];
};
