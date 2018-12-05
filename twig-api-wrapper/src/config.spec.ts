import { expect } from "chai";
import { config } from "./config";

describe("config", () => {
  it("can use production", () => {
    config.useProduction();
    expect(config.apiUrl).to.equal("https://twig-api.buildit.tools/v2");
  });

  it("can use staging", () => {
    config.useStaging();
    expect(config.apiUrl).to.equal("https://staging-twig-api.buildit.tools/v2");
  });

  it("can use local", () => {
    config.useLocal();
    expect(config.apiUrl).to.equal("http://localhost:3000/v2");
  });

  it("can use a custom url", () => {
    config.useCustomUrl("some url");
    expect(config.apiUrl).to.equal("some url");
  });
});
