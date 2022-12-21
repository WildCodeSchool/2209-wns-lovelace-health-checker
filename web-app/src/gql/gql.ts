/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n": types.CheckUrlDocument,
};

export function graphql(source: "\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n"): (typeof documents)["\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;