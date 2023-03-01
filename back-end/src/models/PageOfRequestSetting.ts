import { Field, Int, ObjectType } from "type-graphql";
import RequestSetting from "../entities/RequestSetting.entity";

@ObjectType()
class PageOfRequestSetting {
  @Field(() => Int)
  totalCount: number;

  @Field(() => Int, { nullable: true })
  nextPageNumber: number | null;

  @Field(() => [RequestSetting])
  requestSettings: RequestSetting[];
}
export default PageOfRequestSetting;
