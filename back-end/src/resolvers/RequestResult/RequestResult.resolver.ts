import { Args, Mutation, Resolver } from "type-graphql";

import RequestResult from "../../entities/RequestResult.entity";
import RequestResultService from "../../services/RequestResult/RequestResult.service";

import { checkUrlArgs } from "./RequestResult.input";

@Resolver(RequestResult)
export default class RequestResultResolver {
  @Mutation(() => RequestResult)
  async checkUrl(
    @Args()
    { url }: checkUrlArgs
  ): Promise<RequestResult> {
    return await RequestResultService.checkUrlForHomepage(url);
  }
}
