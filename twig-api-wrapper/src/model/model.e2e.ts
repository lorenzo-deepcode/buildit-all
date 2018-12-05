/* tslint:disable:no-unused-expression */
import { expect } from "chai";
import { pick } from "ramda";
import { login } from "../";
import { config } from "../config";
import { cookieJar } from "../rpOptions";
import { IEntityAttribute, IModelCreation, IModelListResponse, IModelResponse } from "./../interfaces";
import { Model } from "./model";

function newModel(): IModelCreation {
  return {
    commitMessage: "Initial Commit",
    entities: { ent1: {
      attributes: [] as IEntityAttribute[],
      class: "ent1",
      image: "A",
    }},
    name: "WRAPPER TEST",
  };
}

describe("Models", () => {
  before(async () => {
    config.useLocal();
    await login("ben.hernandez@corp.riglet.io", "Z3nB@rnH3n");
  });

  describe("create", () => {
    let model: Model;
    let modelCount: number;

    before(async () => {
      modelCount = (await Model.getList()).length;
      model = await Model.create(newModel());
    });

    after(async () => {
      await model.remove();
    });

    it("names the model correctly", () => {
      expect(model.name).to.equal(newModel().name);
    });

    it("increases the number of models in the list", async () => {
      const currentCount = (await Model.getList()).length;
      expect(currentCount).to.equal(modelCount + 1);
    });
  });

  describe("getList", () => {
    let list: IModelListResponse[];
    let model: Model;
    before(async () => {
      model = await Model.create(newModel());
      list = await Model.getList();
    });

    after(async () => {
      await model.remove();
    });

    it("gets a list of the models", () => {
      expect(list.length).to.be.at.least(1);
    });

    it("has a name key in the list entries", () => {
      expect(list[0].name).not.to.be.undefined;
    });

    it("has a url key in the list entries", () => {
      expect(list[0].url).not.to.be.undefined;
    });
  });

  describe("instance", () => {
    let model: Model;
    before(async () => {
      await Model.create(newModel());
      const list = await Model.getList();
      const entry = list.filter((e) => e.name === newModel().name)[0];
      model = await Model.instance(entry.url);
    });

    after(async () => {
      await model.remove();
    });

    it("returns the entities", () => {
      expect(model.entities).to.deep.equal(newModel().entities);
    });

    it("returns the name", () => {
      expect(model.name).to.equal(newModel().name);
    });

    it("returns the latest commit", () => {
      const unchangingVariables = ["message", "user"];
      expect(pick(unchangingVariables, model.latestCommit)).to.deep.equal({
        message: "Initial Commit",
        user: "ben.hernandez@corp.riglet.io",
      });
    });
  });

  describe("update", () => {
    let model: Model;
    function modelUpdates(commitMessage = "") {
      return {
        commitMessage,
        entities: { ent2: {
          attributes: [] as IEntityAttribute[],
          class: "ent2",
          image: "B",
        }},
        name: "A NEW NAME",
      };
    }

    describe("name updates", () => {
      const newCommitMessage = "Changing the name";
      before(async () => {
        await Model.create(newModel());
        const list = await Model.getList();
        const entry = list.filter((e) => e.name === newModel().name)[0];
        model = await Model.instance(entry.url);
        await model.update(pick(["name", "commitMessage"], modelUpdates(newCommitMessage)));
      });

      after(async () => {
        await model.remove();
      });

      it("does not change the entites", () => {
        expect(model.entities).to.deep.equal(newModel().entities);
      });

      it("updates the name", () => {
        expect(model.name).to.equal(modelUpdates().name);
      });

      it("updates the latest commit", () => {
        expect(model.latestCommit.message).to.equal(newCommitMessage);
      });
    });

    describe("entity updates", () => {
      const newCommitMessage = "Changing the entities";
      before(async () => {
        await Model.create(newModel());
        const list = await Model.getList();
        const entry = list.filter((e) => e.name === newModel().name)[0];
        model = await Model.instance(entry.url);
        await model.update(pick(["entities", "commitMessage"], modelUpdates(newCommitMessage)));
      });

      after(async () => {
        await model.remove();
      });

      it("updates the entities", () => {
        expect(model.entities).to.deep.equal(modelUpdates().entities);
      });

      it("does not change the name", () => {
        expect(model.name).to.equal(newModel().name);
      });

      it("updates the latest commit", () => {
        expect(model.latestCommit.message).to.equal(newCommitMessage);
      });
    });

    describe("updating both name and entities", () => {
      const newCommitMessage = "Changing both";
      before(async () => {
        await Model.create(newModel());
        const list = await Model.getList();
        const entry = list.filter((e) => e.name === newModel().name)[0];
        model = await Model.instance(entry.url);
        await model.update(pick(["name", "entities", "commitMessage"], modelUpdates(newCommitMessage)));
      });

      after(async () => {
        await model.remove();
      });

      it("updates the entities", () => {
        expect(model.entities).to.deep.equal(modelUpdates().entities);
      });

      it("updates the name", () => {
        expect(model.name).to.equal(modelUpdates().name);
      });

      it("updates the latest commit", () => {
        expect(model.latestCommit.message).to.equal(newCommitMessage);
      });
    });
  });

  describe("remove", () => {
    let list: IModelListResponse[];
    let newList: IModelListResponse[];
    let model: Model;
    before(async () => {
      await Model.create(newModel());
      list = await Model.getList();
      const entry = list.filter((e) => e.name === newModel().name)[0];
      model = await Model.instance(entry.url);
      await model.remove();
      newList = await Model.getList();
    });

    it("the list of models decreases by 1", async () => {
      expect(newList.length).to.equal(list.length - 1);
    });

    it("removes the model from the list of models", () => {
      expect(newList.every((entry) => entry.name !== newModel().name));
    });

    it("clears out the entities", () => {
      expect(model.entities).to.be.null;
    });

    it("clears the name out of the model", () => {
      expect(model.name).to.be.null;
    });

    it("clears out the latestCommit", () => {
      expect(model.latestCommit).to.be.null;
    });
  });

  describe("changelog", () => {
    let model: Model;
    function modelUpdates(commitMessage = "") {
      return {
        commitMessage,
        entities: { ent2: {
          attributes: [] as IEntityAttribute[],
          class: "ent2",
          image: "B",
        }},
        name: "A NEW NAME",
      };
    }
    before(async () => {
      await Model.create(newModel());
      const list = await Model.getList();
      const entry = list.filter((e) => e.name === newModel().name)[0];
      model = await Model.instance(entry.url);
    });

    after(async () => {
      await model.remove();
    });

    it("can get the initial changelog", async () => {
      const changelog = await model.changelog.getList();
      expect(changelog[0].message).to.equal(newModel().commitMessage);
    });

    it("can get the updated changelog", async () => {
      await model.update(pick(["name", "commitMessage"], modelUpdates("new name")));
      const changelog = await model.changelog.getList();
      expect(changelog[0].message).to.equal("new name");
    });
  });
});
