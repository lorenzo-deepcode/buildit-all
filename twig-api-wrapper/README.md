# @buildit/twig-api-wrapper

## PURPOSE

This project is a nodejs helper library for getting data into [Twig](http://github.com/buildit/twig). It is designed to abstract out all of the HTTP calls necessary so you can get right into the data entry. This project is written in typescript and published with definition files allowing you to take advantage of editors with proper code completion such as [vscode](https://code.visualstudio.com/). If your editor supports it, it will also help with paremeters for each method.
![intellisense demo](images/intellisense.png)

The entire library is promise based and in these examples we will be taking advantage of IIFEs and the async/await spec included by default in node >= v7.6

## Table of Contents

* [Installation and Setup](#installation-and-setup)
* [Model Manipulation](#model-manipulation)
* [Twiglet Maniupation](#twiglet-manipulation)
* [Events and Sequences](#events-and-sequences)
* [Other Methods](#other-methods)

## Installation and Setup

```Shell
npm install -S @buildit/twig-api-wrapper
```

Then in your project

```JavaScript
const { config, login, Twiglet, Model } = require('@buildit/twig-api-wrapper');

(async function main() {
  try {
    config.useLocal(); // also .useStaging() and .useProduction()
    await login("ben.hernandez@corp.riglet.io", "my super secure password")
  } catch (error) {
    console.err(error);
  }
})()
```

## Model Manipulation

```JavaScript
(async function main() {
  try {
    // setup
    config.useLocal();
    await login("ben.hernandez@corp.riglet.io", "my super secure password")
    // create a model.
    const newModel = await Model.create({
      name: 'a new model',
      commitMessage: 'initial commit',
      entities: {
        users: { class: 'user-circle-o', image: 'A', attributes: [] },
        bugs: { class: 'bug', image: 'B', attributes: [] }
      }
    });

    // update a model, could also update entities here, works like a patch
    await newModel.update({ name: 'this name is better', commitMessage: 'did not like old name'})

    // model information
    console.log('the entitites', newModel.entities);
    console.log('the name', newModel.name);
    console.log('latest commit message', newModel.latestCommit)
    console.log('older changelog entries', await newModel.changelog.getList());

    // delete a model.
    await newModel.remove()

    // Get a list of all of the models
    const list = await Model.getList();
    console.log(list);

    // load the bsc model
    const bscUrl = list.filter(m => m.name === 'bsc')[0].url;
    const bsc = await Model.instance(bscUrl);
    console.log(bsc.entities);
  } catch (error) {
    console.error(error);
  }
})()
```

## Twiglet Manipulation

```JavaScript
(async function main() {
  try {
    // setup
    config.useLocal();
    await login("ben.hernandez@corp.riglet.io", "my super secure password")

    // Twiglet creation
    const newTwiglet = await Twiglet.create({
      name: 'a new twiglet',
      commitMessage: 'initial creation',
      description: 'this is a demo twiglet',
      model: 'bsc',
    });

    // Twiglet updating (could also update name and description, works like a patch)
    await newTwiglet.update({
      commitMessage: 'adding some nodes and links',
      links: [
        { id: 'one-to-two', source: '2', target: '1' }
      ],
      nodes: [
        { id: '1', name: 'one', type: 'person' },
        { id: '2', name: 'two', type: 'tribe' }
      ],
    });

    // Twiglet information
    console.log('Name', newTwiglet.name);
    console.log('Description', newTwiglet.description);
    console.log('Nodes', newTwiglet.nodes);
    console.log('Links', newTwiglet.links);
    console.log('Latest Commit', newTwiglet.latestCommit);
    console.log('Entire changelog', await newTwiglet.changelog.getList());

    // Delete a Twiglet
    await newTwiglet.remove();

    // Get a list of all the twiglets
    const list = await Twiglet.getList();
    console.log(list);

    // Loading a specific twiglet
    const slackUrl = list.filter(t => t.name === 'slack-analysis')[0].url;
    const slack = await Twiglet.instance(slackUrl);
    console.log(slack.name);
  } catch (error) {
    console.error(error);
  }
})()
```

## Events and Sequences

```Javascript
(async function main() {
  try {
    // setup
    config.useLocal();
    await login("ben.hernandez@corp.riglet.io", "my super secure password")
    // Note, since I am bypassing any lists with this instance and just providing a direct url, it does not matter what I set my config to, this will use localhost no matter what. Better make sure you are authenticated against that server before going direct to urls.
    const emails = await Twiglet.instance('http://localhost:3000/v2/twiglets/Emails');

    // Create an event
    await emails.events.create({ name: 'event 1', description: 'the first event'});

    // Getting a list of events
    const eventsList = await emails.events.getList();
    console.log(eventsList);
    /**
     * ...
     * { id: '46a15ed5-6a0d-4bbf-8fde-5696a5f0147b',
     *   name: 'event 1',
     *   description: 'the first event',
     *   url: 'http://localhost:3000/v2/twiglets/Emails/events/46a15ed5-6a0d-4bbf-8fde-5696a5f0147b' } ]
     */

    // deleting an event
    await emails.events.deleteOne('http://localhost:3000/v2/twiglets/Emails/events/46a15ed5-6a0d-4bbf-8fde-5696a5f0147b');

    // Create a sequence
    // Note, a sequence is just an array of event IDs so we are going to use ids from the list above
    await emails.sequences.create({
      description: 'a series of unfortunate events',
      name: 'sequence 1',
      events: [eventsList[0].id, eventsList[4].id, eventsList[10].id],
    })

    // Getting a list of sequences
    const sequenceList = await emails.sequences.getList();
    console.log(sequenceList);
    /**
     * ...
     * { description: 'a series of unfortunate events',
     *   events:
     *     [ 'eafd9c10-f622-4050-b18c-29764ce0c375',
     *       'cbfced59-08c6-406b-b457-d4ca04ff3efc',
     *       'b750855b-c590-4cb2-9dea-eff96269c3e3' ],
     *   id: 'e6c5f16e-ad24-443b-a825-2cbc0ea869d3',
     *   name: 'sequence 1',
     *   url: 'http://localhost:3000/v2/twiglets/Emails/sequences/e6c5f16e-ad24-443b-a825-2cbc0ea869d3' } ]
     */

    // deleting a sequence
    await emails.sequences.deleteOne('http://localhost:3000/v2/twiglets/Emails/sequences/e6c5f16e-ad24-443b-a825-2cbc0ea869d3')
  } catch (error) {
    console.error(error);
  }
})()
```

## Other Methods

There are a lot of other methods inside this wrapper. At the time of this writing, every method on the API has a corresponding method here. To get a good feel for how to use them, check out the e2e tests accompanying Models and Twiglets.

## Contributing

Feel free to update/add methods as needed. This package is published on npm under the @buildit organization. Write unit/e2e tests as appropriate then version and publish. Since these are mostly just wrappers around API calls, I found it was more useful to write e2e tests for most methods.

```Shell
npm version major | minor | patch
npm publish --access=public
```
