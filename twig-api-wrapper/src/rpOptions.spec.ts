// tslint:disable no-unused-expression
import { expect } from "chai";
import { rpOptions } from "./rpOptions";

describe("rpOptions", () => {
  it("always uses the same cookie jar", () => {
    const call1 = rpOptions("GET", "some url");
    const call2 = rpOptions("POST", "some other url");
    expect(call1.jar).to.equal(call2.jar);
  });

  it("uses the correct method", () => {
    expect(rpOptions("GET", "some url").method).to.equal("GET");
  });

  it("uses the correct uri", () => {
    expect(rpOptions("GET", "some url").uri).to.equal("some url");
  });

  it("omits the body for GET", () => {
    expect(rpOptions("GET", "some url", { some: "body" }).body).to.be.undefined;
  });

  it("omits the body for DELETE", () => {
    expect(rpOptions("DELETE", "some url", { some: "body" }).body).to.be.undefined;
  });

  it("uses the body for POST", () => {
    expect(rpOptions("POST", "some url", { some: "body" }).body).to.deep.equal({ some: "body" });
  });

  it("uses the body for PUT", () => {
    expect(rpOptions("PUT", "some url", { some: "body" }).body).to.deep.equal({ some: "body" });
  });

  it("uses the body for PATCH", () => {
    expect(rpOptions("PATCH", "some url", { some: "body" }).body).to.deep.equal({ some: "body" });
  });
});
