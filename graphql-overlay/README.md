# GraphQL sample code

This implementation showcases a GraphQL server built upon [The Guardian's api](http://open-platform.theguardian.com/).

---

## Quick start
(you'll need `yarn` installed on your computer)

### A. create a `conf.js` file with a Guardian app key

```
{
  "key": "<your guardian key>"
}
```

### B. Install and launch

```
$ make
```

### C. Open [graphiQL](http://localhost:3000/graphiql)

## Sample queries:

```graphql
query {
  tags {
    webTitle
  }
}
```

```graphql
query {
  section(id: "artanddesign"){
    id
    articles (query:"science") {
      webTitle
    }
  }
}
```

```graphql
query {
  sections(limit: 2){
    id
    articles (query:"science") {
      webTitle
    }
  }
}
```