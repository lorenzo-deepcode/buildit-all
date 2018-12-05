import { expect } from "chai";
import { login } from "./";
import { config } from "./config";
import { cookieJar } from "./rpOptions";

describe("login stores a cookie", () => {
  before(() => {
    config.useLocal();
  });

  it("stores a cookie", async () => {
    await login("ben.hernandez@corp.riglet.io", "Z3nB@rnH3n");
    expect(cookieJar.getCookies("http://localhost").length).to.equal(1);
  });
});
