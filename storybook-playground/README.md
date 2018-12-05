# Storybook Playground
Playground for storybook plugins etc.

If you want to run the static builds and browse the versions then:
```
npm i
npm run example
```

then open http://localhost:8000.

There is currently a basic config in the example folder. You can copy that into `.storybook` for local builds too. You will have to add a blabbr section if you want to use that plugin.

_Note:_ If you want to navigate to the dev version using the `local dev` you also need to run the local build. Just `npm start` for that in a separate terminal.

## Developing with Add-ons locally

As per the [Storybook Addons documentation](https://storybooks.js.org/docs/react-storybook/addons/writing-addons/#local-development), you can use locally developed addons with the playground by updating the `package.json` to reference the location in the file system e.g.

```
{
  ...
  "dependencies": {
    "@buildit/storybook-addon-blabbr": "file:///home/username/myrepo",
  }
  ...
}
```
