import { Args, Mutation, Resolver } from 'type-graphql';

import RequestResult from '../../entities/RequestResult.entity';
import { HomepageRequestResult } from '../../models/requestResult.model';
import RequestResultService from '../../services/RequestResult.service';
import { checkUrlArgs } from './RequestResult.input';

@Resolver(RequestResult)
export default class RequestResultResolver {
  // @Query(() => RequestResult)
  // checkUrl(
  //   @Args()
  //   { url }: checkUrlArgs
  // ): HomepageRequestResult {
  //   // TODO checker une url pour de vrai

  //   return RequestResultService.checkUrl(url);
  // }

  @Mutation(() => RequestResult)
  checkUrl(
    @Args()
    { url }: checkUrlArgs
  ): HomepageRequestResult {
    // TODO checker une url pour de vrai

    return RequestResultService.checkUrl(url);
  }
}
