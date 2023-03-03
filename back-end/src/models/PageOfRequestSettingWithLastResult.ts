import { Field, Int, ObjectType } from "type-graphql";
import RequestSettingWithLastResult from "./RequestSettingWithLastResult";

@ObjectType()
class PageOfRequestSettingWithLastResult {
  @Field(() => Int)
  totalCount: number;

  @Field(() => Int, { nullable: true })
  nextPageNumber: number | null;

  @Field(() => [RequestSettingWithLastResult])
  requestSettingsWithLastResult: RequestSettingWithLastResult[];
}
export default PageOfRequestSettingWithLastResult;
