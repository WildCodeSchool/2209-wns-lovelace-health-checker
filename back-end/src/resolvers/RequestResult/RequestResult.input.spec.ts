import "reflect-metadata";

import { validate } from "class-validator";
import { checkUrlArgs } from "./RequestResult.input";

describe("checkUrlArgs", () => {
  it("should return no errors for a valid URL with protocol https", async () => {
    const args = new checkUrlArgs();
    args.url = "https://www.example.com";
    const errors = await validate(args);
    expect(errors).toHaveLength(0);
  });

  it("should return no errors for a valid URL with protocol http", async () => {
    const args = new checkUrlArgs();
    args.url = "http://www.example.com";
    const errors = await validate(args);
    expect(errors).toHaveLength(0);
  });

  it("should return no errors for a valid URL with no subdomain", async () => {
    const args = new checkUrlArgs();
    args.url = "https://example.com";
    const errors = await validate(args);
    expect(errors).toHaveLength(0);
  });

  it("should return an error for an invalid URL when the argument is not an URL", async () => {
    const args = new checkUrlArgs();
    args.url = "invalid";
    const errors = await validate(args);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual("url");
    expect(errors[0].constraints).toHaveProperty("matches");
  });

  it("should return an error for an invalid URL when the Top Level Domain is missing", async () => {
    const args = new checkUrlArgs();
    args.url = "https://www.example.";
    const errors = await validate(args);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual("url");
    expect(errors[0].constraints).toHaveProperty("matches");
  });

  it("should return an error for an invalid URL when the protocol is missing", async () => {
    const args = new checkUrlArgs();
    args.url = "www.example.com";
    const errors = await validate(args);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual("url");
    expect(errors[0].constraints).toHaveProperty("matches");
  });
});
