Giri-kur

![Giri kur: Sumerian for "to change"](http://psd.museum.upenn.edu/epsd/psl/img/thumb/Okjz.png)

Pile of SCSS -> More sane SCSS processor

# Things you can do
* `npm run doc` Generates esdoc and opens your browser to look at it.
* `bin/create-scss-from-raw.js --help` tells you how to use the thing.
* `bin/incorporate-brandai.js --help` tells you how to incorporate a brandai brand package

# Installation
This was built using yarn as package manager, but there should be no issue just using regular npm as well.
## Yarn
* `npm install -g yarn`
* `yarn`
## NPM
`npm install`

# Folder structure

`create-scss-from-raw` expects the src folder to only have scss/css files in it.  Depending on
the contents of any other files, the resulting output can be unpredictable.  It will output in the
following structure:

```
destination
  ↳ scss
    ↳ main.scss
      _variables.scss
    ↳ components
      ↳ 1-Atoms
        ↳ some-atom.scss
```

`incorporate-brandai` expects the folder structure defined in `create-scss-from-raw`, but the only
required files are `main.scss` and `_variables.scss`.
