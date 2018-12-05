# Design Thinking Template

Contributors: Richard Knights, Jonathan Lazarini, James Nash, Ben Oakenfull & Marcos Peebles

+ Team involved in specific project
+ Add Stanford and Ideo creds
+ Add html5up and pixelarity creds
+ humans.txt

## Usage

Each HTML file is generated from mustache temples and their respective json files.

### Templates

* `index.mustache` - home page (full screen slider) template
* `tiles.mustache` - "Work & Photos" template
* `split.mustache` - demo pages for prototype example
* `fullscreen.mustache` - template for fullscreen demo page (video)

### Data files

* `index.json` - data file for `index.mustache`
* `empathize.json`, `define.json`, `ideate.json`, `test.json`, `iterate.json` - data files for `tiles.mustache`
* `prototype-one(x).json` - data files for `split.mustache`
* `prototype-home.json` - data file for `fullscreen.mustache`

### Building

* `npm run build` - compiles all templates and moves files to dist
* `npm run serve` - run app

**Note:** Each template and data file is directly referenced from package.json file - so be aware of file name changes etc.

## Licenses

Licensed under the MIT license, [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)

### Full Screen Background Video

  Creating a full screen background video with HTML5 and CSS. Makes use of some modern JS to detect whether video has buffered enough to allow autoplay to play through nicely.
  Copyright 2014, Call Me Nick [http://callmenick.com](http://callmenick.com)

## Live Demo

[View the live demo here](http://sales-wiprodigitalstudio-com.s3-website-us-east-1.amazonaws.com/bp/).
