import { Field, Int, ObjectType } from "type-graphql";
import RequestSettingWithLastResult from "./RequestSettingWithLastResult";

@ObjectType()
class PageOfRequestSettingWithLastResult {
  @Field(() => Int)
  totalCount: number;

  @Field(() => [RequestSettingWithLastResult])
  requestSettingsWithLastResult: RequestSettingWithLastResult[];
}
export default PageOfRequestSettingWithLastResult;
