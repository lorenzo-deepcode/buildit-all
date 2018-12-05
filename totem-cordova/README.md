## Totem Cordova App

### Getting started
---

First, make sure that you have Node and npm installed on your system.
This has been tested with node 8+ on a Unix based system. It WILL NOT work on Windows just yet.

Install cordova:

```
npm i -g cordova
```

You then need to clone the main [Totem app repo](https://github.com/buildit/totem)
Please make sure that the Totem app and this repo are next to each other, such that your
directory structure looks like this:

```
totem
totem-cordova
```

Inside totem-cordova (or the directory where you cloned this repo) run:

```
npm i
```

It should install all the plugins, and also symlink the totem directory to www.

If not, you can then create your own symlink by running:

```
ln -s ../totem/www ../totem-cordova/
```