# 🌮 Taco Style 🕺



A style library for Project T.A.C.O., which is a short undertaking between BuildIt and DesignIt in NYC.

In order to update and have your updates show up on the app or the living style guide here is what you need to do:

Part One

Make your changes on the style repo
Save and check in your updates to the repo
Go to the project on the command line and use this npm command - npm version patch. This will make sure that a new npm package is created with a new version number.
Check in the updated json with the new verison number.

Part Two - if you want the new changes to show up on the living style guide.

Go to Travis and restart the build on the living style guide.

Part Three - if you want the new changes to show up on the app itself.

Go to Travis and restart the build on the taco app. Keep in mind other dev's maybe be working on the app so double check to make sure someone is not trying to push a build or a push at the same time.

The suggestion is to at least do the build on the living style guide when you make a change and only rebuild the app if you have to.

