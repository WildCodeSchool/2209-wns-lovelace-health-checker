import { Field, ObjectType } from "type-graphql";
import RequestResult from "../entities/RequestResult.entity";
import RequestSetting from "../entities/RequestSetting.entity";

@ObjectType()
export default class RequestSettingWithLastResult {
  constructor(
    requestSetting: RequestSetting,
    requestResult: RequestResult | null
  ) {
    this.requestSetting = requestSetting;
    this.requestResult = requestResult;
  }

  @Field(() => RequestSetting)
  requestSetting: RequestSetting;

  @Field(() => RequestResult, { nullable: true })
  requestResult?: RequestResult | null;
}
