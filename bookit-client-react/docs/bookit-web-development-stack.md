Bookit-Web Development Stack
============================

Core Libraries
--------------
- react
- react-dom
- redux
- redux-saga
- redux-actions
- redux-form
- reselect
- normalizr *
- immutable **
- reselect-immutable-helpers **

* Normalizr is _incredibly_ useful for turning JSON payloads into
distinctly grouped sets of entities, along with the order they
arrived in contained in a separate `results` list.

Any child entities that appear within an entity are replaced with the
key of that child entity, which you can then use to select from
_its_ entity collection.

** Immutable provides great utility out of the box by minimizing
unnecessary state changes, and relieves the pain in creating selectors
for values that may or may not exist. Reselect-Immutable-Helpers adds
features to Reselect that wrap around the notion of working with
immutable data.

When used correctly with selectors, the usage of Immutable for the
combined redux store is essentially transparent.

Infrastructure Libraries
------------------------
- babel
- webpack

Since both babel and webpack introduce many, many supporting libraries
themselves, it is not trivial to list every single library that we would
end up using from both these two libraries.

Testing Libraries
-----------------
- jest
- enzyme
- chai
- chai-enzyme
- cucumber-js
- selenium

Jest for collecting and running tests and providing assertions.
Enzyme for faking DOM for shallow render assertions.

Chai and Chai-Enzyme for nicer, chained assertions and additional
extensions to support expectations driven by enzyme.

https://github.com/remcohaszing/chai-enzyme

- https://dashbouquet.com/blog/frontend-development/usage-of-reselect-in-a-react-redux-application
  - Specifically "Top tips to make your life better"

Cucumber and Selenium for end to end integration tests.

Supporting Arguments
--------------------
- Given the requirements for the code, we know what actions the user
will end up taking, and by combining related actions, they are reduced
further still.

With the above in mind, we can also reduce the number of actions down
based on explicit vs. implicit actions - explicit actions are lightweight
actions, preferably with no payload or at most, a single argument payload.

Explicit actions can (and often will) trigger one or more _implicit_ actions
via sagas.

- Components - regardless of them being stateless, stateless-functional
or stateful should _never_ have business logic in them.

That is to say, given a component that's connected to the redux store,
the only thing a component should do is dispatch actions that are
intercepted by a saga that contains business logic. Done this way, we
isolate _all_ business logic into a single area of code - sagas - and
our components become simpler due to them either just simply presenting
data, providing a control that dispatches actions or both.

- Do not select data from state and mutate it within a component to
fit your needs. Instead, write a selector that is composed of the
selector you need, and return a mutated copy of that selected data
and import that instead.

In the world of redux, reducers are _writers_ and selectors are _readers_.
By using a lower-level selector on a slice of state that isn't protected
by virtue of being wrapped up in an immutable object you stand the chance
of accidentally mutating state outside the context of redux as a whole.

By creating very specific selectors that provide the data you need in
an already "mutated" format, you contain this mutated state slice in
the same place as all the other selectors, and you avoid cluttering up
components with miscellaneous formatting/mutating code, leaving them
clean and concise.

There are of course exceptions to this rule... For example, let's say
you have a selector that returns a raw string from state that represents
an ISO date in the form of 'YYYY-MM-DD'. The selector may look like the
following:
```
const state = { someDate: '1979-08-24' }  // Fake state (hint: this is how you test selectors)

const getSomeDate = state => state.someDate
```

...Which by calling would give you the result of `1979-08-24`.

So you realize it would be nice if instead of a raw string representing
a date, you would like that date as a Date or Moment object.

If you didn't not make a selector for it, you would end up possibly
doing something like:
```
...
const someDate = getSomeDate(state)
const someDateMoment = Moment(someDate)
```

Oh boy, that looks pretty bad. So let's fix that by writing a composed
selector:
```
const state = { someDate: '1979-08-24' }  // Fake state (hint: this is how you test selectors)

const getSomeDate = state => state.someDate
const getSomeDateMoment = state => Moment(getSomeDate(state))
// - or alternatively (but not recommended - keep reading) -
const getSomeDateMoment = state => Moment(state.someDate)
```

Note that the alternative case of just pulling from state directly is
_completely doable_, but _not recommended_. Why? Well, what if at some
point we reorganize the shape of the state in the redux store, and
suddenly `state.someDate` is moved under `state.subState.someDate`?

If we used the alternate form, we would have to fix the code in two
(in this case, in other situations potentially a lot more) places.

Instead, by composing selectors, you don't need to care where `someDate`
actually lives within the store, because the `getSomeDate` selector
cleanly abstracts that away from any other selector that wants to compose
`someDate` into their own selector.

- Normalizr for... normalising (and denormalizing!) API response data.

Here's a trivial example that should explain the benefits:
```
{
  id: 123,
  author: {
    id: 1,
    name: 'Paul'
  },
  title: 'My awesome blog post',
  comments: [
    {
      id: 324,
      commenter: {
        id: 2,
        name: 'Nicole'
      }
    }
  ]
}
```
We have two nested entity types within our article: users and comments. Using various schema, we can normalize all three entity types down:
```
import { normalize, schema } from 'normalizr'

// Define a users schema
const user = new schema.Entity('users')

// Define your comments schema
const comment = new schema.Entity('comments', {
  commenter: user
})

// Define your article
const article = new schema.Entity('articles', {
  author: user,
  comments: [ comment ]
})

const normalizedData = normalize(originalData, article)
```
Now, normalizedData will be:
```
{
  result: 123,
  entities: {
    articles: {
      123: { id: 123,  author: 1, title: 'My awesome blog post', comments: [ 324 ] }
    },
    users: {
      1: { id: 1, name: 'Paul' },
      2: { id: 2, name: 'Nicole' }
    },
    comments: {
      324: { id: 324, commenter: 2 }
    }
  }
}
```
To make this clear, normalizr took the original data and through normalizing
it replaced all nested objects that were defined as Entities and replaced
them with a reference to the entity which can be then be looked up via
its own collection.

There are more powerful features that normalizr provides, such as the
ability to use a function for processing each individual entity as it
is being normalized, allowing you to add, remove or mutate properties
before being returned to the resulting entity collection.

There is an experimental branch on bookit-web that uses normalizr against
our meeting data - https://github.com/buildit/bookit-web/blob/experiments/super-refactor/src/schema.js
