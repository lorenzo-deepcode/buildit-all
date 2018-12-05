/* tslint:disable:no-unused-expression */
import { expect } from "chai";
import { pick } from "ramda";
import { login } from "../";
import { config } from "../config";
import {
  IEntity,
  IEntityAttribute,
  ILatestCommit,
  ILink,
  INode,
  ISequence,
  ITwigletCreation,
  ITwigletListResponse,
  ITwigletResponse,
  ITwigletUpdate,
 } from "../interfaces";
import { Model } from "../model";
import { cookieJar } from "../rpOptions";
import { Twiglet } from "./twiglet";

function newTwiglet(): ITwigletCreation {
  return {
    commitMessage: "Initial Commit",
    description: "Testing the API wrapper",
    model: "WRAPPER TEST MODEL",
    name: "WRAPPER TEST",
  };
}

function twigletDetails(commitMessage = ""): ITwigletUpdate {
  return {
    commitMessage,
    description: "A NEW DESCRIPTION",
    links: [
      {
        id: "1-2",
        source: "1",
        target: "2",
      },
    ],
    name: "A NEW NAME",
    nodes: [
      {
        id: "1",
        name: "one",
        type: "ent1",
      },
      {
        id: "2",
        name: "two",
        type: "ent2",
      },
    ],
  };
}

function newModel() {
  return {
    commitMessage: "initial commit",
    entities: {
      ent1: {
        attributes: [] as IEntityAttribute[],
        class: "class1",
        image: "A",
        type: "ent1",
      },
      ent2: {
        attributes: [] as IEntityAttribute[],
        class: "class2",
        image: "B",
        type: "ent2",
      },
    },
    name: "WRAPPER TEST MODEL",
  };
}

describe("Twiglets", () => {
  let model: Model;
  before(async () => {
    config.useLocal();
    await login("ben.hernandez@corp.riglet.io", "Z3nB@rnH3n");
    model = await Model.create(newModel());
  });

  after(async () => {
    await model.remove();
  });

  describe("create", () => {
    let twiglet: Twiglet;
    let twigletCount: number;

    before(async () => {
      twigletCount = (await Twiglet.getList()).length;
      twiglet = await Twiglet.create(newTwiglet());
    });

    after(async () => {
      await twiglet.remove();
    });

    it("names the twiglet correctly", () => {
      expect(twiglet.name).to.equal(newTwiglet().name);
    });

    it("increases the number of twilgets in the list", async () => {
      const currentCount = (await Twiglet.getList()).length;
      expect(currentCount).to.equal(twigletCount + 1);
    });
  });

  describe("getList", () => {
    let list: ITwigletListResponse[];
    let twiglet: Twiglet;
    before(async () => {
      twiglet = await Twiglet.create(newTwiglet());
      list = await Twiglet.getList();
    });

    after(async () => {
      await twiglet.remove();
    });

    it("gets a list of the twiglets", () => {
      expect(list.length).to.be.at.least(1);
    });

    it("has a name key in the list entries", () => {
      expect(list[0].name).not.to.be.undefined;
    });

    it("has a description key in the list entries", () => {
      expect(list[0].description).not.to.be.undefined;
    });

    it("has a url key in the list entries", () => {
      expect(list[0].url).not.to.be.undefined;
    });
  });

  describe("instance", () => {
    let twiglet: Twiglet;
    before(async () => {
      await Twiglet.create(newTwiglet());
      const list = await Twiglet.getList();
      const entry = list.filter((e) => e.name === newTwiglet().name)[0];
      const noNodesOrLinks = await Twiglet.instance(entry.url);
      await noNodesOrLinks.update(pick(["commitMessage", "links", "nodes"], twigletDetails("adding nodes and links")));
      twiglet = await Twiglet.instance(entry.url);
    });

    after(async () => {
      await twiglet.remove();
    });

    it("returns the description", () => {
      expect(twiglet.description).to.equal(newTwiglet().description);
    });

    it("returns the links", () => {
      expect(twiglet.links).to.deep.equal(twigletDetails().links);
    });

    it("returns the name", () => {
      expect(twiglet.name).to.equal(newTwiglet().name);
    });

    it("returns the nodes", () => {
      expect(twiglet.nodes).to.deep.equal(twigletDetails().nodes);
    });

    it("returns the latest commit", () => {
      const unchangingVariables = ["message", "user"];
      expect(pick(unchangingVariables, twiglet.latestCommit)).to.deep.equal({
        message: "adding nodes and links",
        user: "ben.hernandez@corp.riglet.io",
      });
    });
  });

  describe("update", () => {
    let twiglet: Twiglet;

    describe("description updates", () => {
      const newCommitMessage = "Changing the name";

      before(async () => {
        await Twiglet.create(newTwiglet());
        const list = await Twiglet.getList();
        const entry = list.filter((e) => e.name === newTwiglet().name)[0];
        twiglet = await Twiglet.instance(entry.url);
        await twiglet.update(pick(["description", "commitMessage"], twigletDetails(newCommitMessage)));
      });

      after(async () => {
        await twiglet.remove();
      });

      it("updates the description", () => {
        expect(twiglet.description).to.deep.equal(twigletDetails().description);
      });

      it("does not change the links", () => {
        expect(twiglet.links).to.deep.equal([]);
      });

      it("does not change the name", () => {
        expect(twiglet.name).to.equal(newTwiglet().name);
      });

      it("does not change the nodes", () => {
        expect(twiglet.nodes).to.deep.equal([]);
      });

      it("updates the latest commit", () => {
        expect(twiglet.latestCommit.message).to.equal(newCommitMessage);
      });
    });

    describe("links updates", () => {
      const newCommitMessage = "Changing the links";

      before(async () => {
        await Twiglet.create(newTwiglet());
        const list = await Twiglet.getList();
        const entry = list.filter((e) => e.name === newTwiglet().name)[0];
        twiglet = await Twiglet.instance(entry.url);
        await twiglet.update(pick(["links", "commitMessage"], twigletDetails(newCommitMessage)));
      });

      after(async () => {
        await twiglet.remove();
      });

      it("does not change the description", () => {
        expect(twiglet.description).to.deep.equal(newTwiglet().description);
      });

      it("updates the links", () => {
        expect(twiglet.links).to.deep.equal(twigletDetails().links);
      });

      it("does not change the name", () => {
        expect(twiglet.name).to.equal(newTwiglet().name);
      });

      it("does not change the nodes", () => {
        expect(twiglet.nodes).to.deep.equal([]);
      });

      it("updates the latest commit", () => {
        expect(twiglet.latestCommit.message).to.equal(newCommitMessage);
      });
    });

    describe("name updates", () => {
      const newCommitMessage = "Changing the name";

      before(async () => {
        await Twiglet.create(newTwiglet());
        const list = await Twiglet.getList();
        const entry = list.filter((e) => e.name === newTwiglet().name)[0];
        twiglet = await Twiglet.instance(entry.url);
        await twiglet.update(pick(["name", "commitMessage"], twigletDetails(newCommitMessage)));
      });

      after(async () => {
        await twiglet.remove();
      });

      it("does not change the description", () => {
        expect(twiglet.description).to.deep.equal(newTwiglet().description);
      });

      it("does not change the links", () => {
        expect(twiglet.links).to.deep.equal([]);
      });

      it("updates the name", () => {
        expect(twiglet.name).to.equal(twigletDetails().name);
      });

      it("does not change the nodes", () => {
        expect(twiglet.nodes).to.deep.equal([]);
      });

      it("updates the latest commit", () => {
        expect(twiglet.latestCommit.message).to.equal(newCommitMessage);
      });
    });

    describe("nodes updates", () => {
      const newCommitMessage = "Changing the nodes";

      before(async () => {
        await Twiglet.create(newTwiglet());
        const list = await Twiglet.getList();
        const entry = list.filter((e) => e.name === newTwiglet().name)[0];
        twiglet = await Twiglet.instance(entry.url);
        await twiglet.update(pick(["nodes", "commitMessage"], twigletDetails(newCommitMessage)));
      });

      after(async () => {
        await twiglet.remove();
      });

      it("does not change the description", () => {
        expect(twiglet.description).to.deep.equal(newTwiglet().description);
      });

      it("does not change the links", () => {
        expect(twiglet.links).to.deep.equal([]);
      });

      it("does not change the name", () => {
        expect(twiglet.name).to.equal(newTwiglet().name);
      });

      it("updates the nodes", () => {
        expect(twiglet.nodes).to.deep.equal(twigletDetails().nodes);
      });

      it("updates the latest commit", () => {
        expect(twiglet.latestCommit.message).to.equal(newCommitMessage);
      });
    });

    describe("multiple updates", () => {
      const newCommitMessage = "Changing everything";

      before(async () => {
        await Twiglet.create(newTwiglet());
        const list = await Twiglet.getList();
        const entry = list.filter((e) => e.name === newTwiglet().name)[0];
        twiglet = await Twiglet.instance(entry.url);
        await twiglet.update(twigletDetails(newCommitMessage));
      });

      after(async () => {
        await twiglet.remove();
      });

      it("updates the description", () => {
        expect(twiglet.description).to.deep.equal(twigletDetails().description);
      });

      it("updates the links", () => {
        expect(twiglet.links).to.deep.equal(twigletDetails().links);
      });

      it("updates the name", () => {
        expect(twiglet.name).to.equal(twigletDetails().name);
      });

      it("updates the nodes", () => {
        expect(twiglet.nodes).to.deep.equal(twigletDetails().nodes);
      });

      it("updates the latest commit", () => {
        expect(twiglet.latestCommit.message).to.equal(newCommitMessage);
      });
    });
  });

  describe("remove", () => {
    let list: ITwigletListResponse[];
    let newList: ITwigletListResponse[];
    let twiglet: Twiglet;
    before(async () => {
      await Twiglet.create(newTwiglet());
      list = await Twiglet.getList();
      const entry = list.filter((e) => e.name === newTwiglet().name)[0];
      twiglet = await Twiglet.instance(entry.url);
      await twiglet.remove();
      newList = await Twiglet.getList();
    });

    it("the list of twiglets decreases by 1", async () => {
      expect(newList.length).to.equal(list.length - 1);
    });

    it("removes the twiglet from the list of twiglets", () => {
      expect(newList.every((entry) => entry.name !== newTwiglet().name));
    });

    it("clears out the description", () => {
      expect(twiglet.description).to.be.null;
    });

    it("clears out the links", () => {
      expect(twiglet.links).to.be.null;
    });

    it("clears the name out of the twiglet", () => {
      expect(twiglet.name).to.be.null;
    });

    it("clears the nodes out of the twiglet", () => {
      expect(twiglet.nodes).to.be.null;
    });

    it("clears out the latestCommit", () => {
      expect(twiglet.latestCommit).to.be.null;
    });
  });

  describe("changelog", () => {
    let twiglet: Twiglet;
    before(async () => {
      await Twiglet.create(newTwiglet());
      const list = await Twiglet.getList();
      const entry = list.filter((e) => e.name === newTwiglet().name)[0];
      twiglet = await Twiglet.instance(entry.url);
    });

    after(async () => {
      await twiglet.remove();
    });

    it("can get the initial changelog", async () => {
      const changelog = await twiglet.changelog.getList();
      expect(changelog[0].message).to.equal(newTwiglet().commitMessage);
    });

    it("can get the updated changelog", async () => {
      await twiglet.update(pick(["name", "commitMessage"], twigletDetails("new name")));
      const changelog = await twiglet.changelog.getList();
      expect(changelog[0].message).to.equal("new name");
    });
  });

  describe("model", () => {
    let twiglet: Twiglet;
    before(async () => {
      await Twiglet.create(newTwiglet());
      const list = await Twiglet.getList();
      const entry = list.filter((e) => e.name === newTwiglet().name)[0];
      twiglet = await Twiglet.instance(entry.url);
    });

    after(async () => {
      await twiglet.remove();
    });

    it("can get the model", async () => {
      const twigletModel: { [key: string]: IEntity } = await twiglet.model.get();
      expect(twigletModel).to.deep.equal(newModel().entities);
    });

    it("can update the model", async () => {
      const newEntities = {
        ent3: {
          attributes: [] as IEntityAttribute[],
          class: "class3",
          image: "C",
          type: "ent3",
        },
        ent4: {
          attributes: [] as IEntityAttribute[],
          class: "class4",
          image: "D",
          type: "ent4",
        },
      };
      await twiglet.model.update({ entities: newEntities, commitMessage: "Updating Model" });
      const twigletModel: { [key: string]: IEntity } = await twiglet.model.get();
      expect(twigletModel).to.deep.equal(newEntities);
    });
  });

  describe("events", () => {
    let twiglet: Twiglet;
    before(async () => {
      await Twiglet.create(newTwiglet());
      const list = await Twiglet.getList();
      const entry = list.filter((e) => e.name === newTwiglet().name)[0];
      twiglet = await Twiglet.instance(entry.url);
      await twiglet.update(twigletDetails("adding nodes"));
    });

    after(async () => {
      await twiglet.remove();
    });

    describe("create", () => {
      const name = "event1";
      before(async () => {
        await twiglet.events.create({ name, description: "some description"});
      });

      after(async () => {
        await twiglet.events.deleteAll();
      });

      it("can create an event", async () => {
        const events = await twiglet.events.getList();
        expect(events.some((event) => event.name === name)).to.be.true;
      });
    });

    describe("deleteAll", async () => {
      before(async () => {
        await twiglet.events.create({ name: "event 1", description: "some description 1"});
        await twiglet.events.create({ name: "event 2", description: "some description 2"});
      });

      it("deletes all of the events", async () => {
        await twiglet.events.deleteAll();
        const events = await twiglet.events.getList();
        expect(events).to.deep.equal([]);
      });
    });

    describe("getList", () => {
      before(async () => {
        await twiglet.events.create({ name: "event 1", description: "some description 1"});
        await twiglet.events.create({ name: "event 2", description: "some description 2"});
      });

      after(async () => {
        await twiglet.events.deleteAll();
      });

      it("gets a list of the events", async () => {
        const events = await twiglet.events.getList();
        expect(events.length).to.equal(2);
      });
    });

    describe("getOne", () => {
      before(async () => {
        await twiglet.events.create({ name: "event 1", description: "some description 1"});
        await twiglet.events.create({ name: "event 2", description: "some description 2"});
      });

      after(async () => {
        await twiglet.events.deleteAll();
      });

      it("gets a list of the events", async () => {
        const events = await twiglet.events.getList();
        const eventUrl = events.filter((e) => e.name = "event 1")[0].url;
        const event = await twiglet.events.getOne(eventUrl);
        expect(event.nodes).not.to.be.undefined;
      });
    });

    describe("deleteOne", () => {
      before(async () => {
        await twiglet.events.create({ name: "event 1", description: "some description 1"});
        await twiglet.events.create({ name: "event 2", description: "some description 2"});
      });

      after(async () => {
        await twiglet.events.deleteAll();
      });

      it("can delete a single event", async () => {
        let events = await twiglet.events.getList();
        const eventUrl = events.filter((e) => e.name = "event 1")[0].url;
        await twiglet.events.deleteOne(eventUrl);
        events = await twiglet.events.getList();
        expect(events.every((e) => e.name !== "event 1")).to.be.true;
      });
    });
  });

  describe("sequences", () => {
    let twiglet: Twiglet;
    before(async () => {
      await Twiglet.create(newTwiglet());
      const list = await Twiglet.getList();
      const entry = list.filter((e) => e.name === newTwiglet().name)[0];
      twiglet = await Twiglet.instance(entry.url);
      await twiglet.update(twigletDetails("adding nodes"));
      await twiglet.events.create({ name: "event 1", description: "some description 1"});
      await twiglet.events.create({ name: "event 2", description: "some description 2"});
      await twiglet.events.create({ name: "event 3", description: "some description 3"});
    });

    after(async () => {
      await twiglet.remove();
    });

    describe("create", async () => {
      after(async () => {
        const sequences = await twiglet.sequences.getList();
        for (const sequence of sequences) {
          await twiglet.sequences.deleteOne(sequence.url);
        }
      });

      it("can create a sequence", async () => {
        const eventsList = await twiglet.events.getList();
        const events = eventsList.filter((e) => !e.name.includes("2")).map((e) => e.id);
        await twiglet.sequences.create({ description: "a new sequence", name: "sequence1", events});
        const sequences = await twiglet.sequences.getList();
        expect(sequences[0].events.length).to.equal(2);
      });
    });

    describe("getList", async () => {
      before(async () => {
        const eventsList = await twiglet.events.getList();
        let events = eventsList.filter((e) => !e.name.includes("2")).map((e) => e.id);
        await twiglet.sequences.create({ description: "a new sequence", name: "sequence1", events});
        events = eventsList.map((e) => e.id);
        await twiglet.sequences.create({ description: "another sequence", name: "sequence2", events});
      });

      after(async () => {
        const sequences = await twiglet.sequences.getList();
        for (const sequence of sequences) {
          await twiglet.sequences.deleteOne(sequence.url);
        }
      });

      it("can get a list of sequences", async () => {
        const sequences = await twiglet.sequences.getList();
        expect(sequences.length).to.equal(2);
      });
    });

    describe("getOne", async () => {
      before(async () => {
        const eventsList = await twiglet.events.getList();
        let events = eventsList.filter((e) => !e.name.includes("2")).map((e) => e.id);
        await twiglet.sequences.create({ description: "a new sequence", name: "sequence1", events});
        events = eventsList.map((e) => e.id);
        await twiglet.sequences.create({ description: "another sequence", name: "sequence2", events});
      });

      after(async () => {
        const sequences = await twiglet.sequences.getList();
        for (const sequence of sequences) {
          await twiglet.sequences.deleteOne(sequence.url);
        }
      });

      it("get a single sequence", async () => {
        const sequences = await twiglet.sequences.getList();
        const sequenceUrl = sequences.filter((s) => s.name === "sequence2")[0].url;
        const sequence = await twiglet.sequences.getOne(sequenceUrl);
        expect(sequence.events.length).to.equal(3);
      });
    });

    describe("update", async () => {
      let originalSequence: ISequence;
      let updateSequence: ISequence;
      before(async () => {
        const eventsList = await twiglet.events.getList();
        let events = eventsList.filter((e) => !e.name.includes("2")).map((e) => e.id);
        await twiglet.sequences.create({ description: "a new sequence", name: "sequence1", events});
        events = eventsList.map((e) => e.id);
        await twiglet.sequences.create({ description: "another sequence", name: "sequence2", events});
        let sequences = await twiglet.sequences.getList();
        originalSequence = sequences.filter((s) => s.name === "sequence1")[0];
        events = eventsList.filter((e) => !e.name.includes("1")).map((e) => e.id);
        await twiglet.sequences.update(originalSequence.url, { description: "changed", name: "new name", events});
        sequences = await twiglet.sequences.getList();
        updateSequence = sequences.filter((s) => s.name === "new name")[0];
      });

      after(async () => {
        const sequences = await twiglet.sequences.getList();
        for (const s of sequences) {
          await twiglet.sequences.deleteOne(s.url);
        }
      });

      it("changes the name", () => {
        expect(updateSequence).not.to.be.undefined;
      });

      it("updates the description", () => {
        expect(updateSequence.description).to.equal("changed");
      });

      it("updates the events", () => {
        expect(updateSequence.events).not.to.deep.equal(originalSequence.events);
      });
    });

    describe("deleteOne", async () => {
      before(async () => {
        const eventsList = await twiglet.events.getList();
        let events = eventsList.filter((e) => !e.name.includes("2")).map((e) => e.id);
        await twiglet.sequences.create({ description: "a new sequence", name: "sequence1", events});
        events = eventsList.map((e) => e.id);
        await twiglet.sequences.create({ description: "another sequence", name: "sequence2", events});
      });

      after(async () => {
        const sequences = await twiglet.sequences.getList();
        for (const s of sequences) {
          await twiglet.sequences.deleteOne(s.url);
        }
      });

      it("removes the sequence", async () => {
        let sequences = await twiglet.sequences.getList();
        const toBeDeletedUrl = sequences.filter((s) => s.name === "sequence1")[0].url;
        await twiglet.sequences.deleteOne(toBeDeletedUrl);
        sequences = await twiglet.sequences.getList();
        expect(sequences.every((s) => s.name !== "sequence1")).to.be.true;
      });
    });
  });
});
