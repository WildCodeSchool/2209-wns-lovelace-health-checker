import { Field, Int, ObjectType } from "type-graphql";
import RequestResult from "../entities/RequestResult.entity";

@ObjectType()
class PageOfRequestResult {
  @Field(() => Int)
  totalCount: number;

  @Field(() => [RequestResult])
  requestResults: RequestResult[];
}
export default PageOfRequestResult;
