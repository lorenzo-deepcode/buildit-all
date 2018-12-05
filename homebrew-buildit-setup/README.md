# Homebrew Buildit Setup

This [Tap](https://github.com/Homebrew/brew/blob/master/docs/How-to-Create-and-Maintain-a-Tap.md) 
is intended to provide an easier way to configure new Macs (i.e. a Mac that has just had its OS fresh installed) 
instead of following multiple Confluence steps.


## Context 

Initially it was intended to be using brew [Formula](https://github.com/Homebrew/brew/blob/master/docs/Formula-Cookbook.md) 
to accomplish this task, but Formulas seems to have a limitation in regards to dependencies: 
a Formula can't depend on a [Cask](https://github.com/caskroom/homebrew-cask/blob/master/USAGE.md).
For this reason, the approach was changed to use Casks instead of Formulas. 

Currently, all the setup is done using existing Formulas or Casks, so the Casks provided here does not install
any Mac App by itself as is expected of Brew Casks, instead it relies on a list of dependencies
for other Formulas and Casks to make sure that everything that is needed is indeed installed on the Mac.

## How to use

First it is necessary to install Homebrew. Information on how this can be done can be found [here](https://brew.sh/)

To make use of these Casks, is is needed to add the Buildit Tap to your local Homebrew.
This can be done with the following command:

```
brew tap buildit/homebrew-buildit-setup
```

After this, your Homebrew will be configured to "see" the Buildit tap with all its available Formulas and Casks.
Also, it will be updated/upgraded with the usual ``home brew update / upgrade`` commands.

## What is available

#### Build Base Tools

This Cask is intended to install the base tools, not making a differentiation on programming
languages/environments.

###### Installation 

```
brew cask install buildit-base-tools
```

###### Contents

The following Casks and Formulas will be installed together with this Cask:

* Git (Formula)
* Bash Completion (Formula)
* Python (Formula)
* Ansible (Formula)
* Terraform (Formula)
* AWS CLI (Formula)
* Packer (Formula)
* Docker (Formula)
* Chromedriver (Formula)
* Dropbox (Cask)
* Google Chrome (Cask)
* Firefox (Cask)
* Atom (Cask)
* Skype (Cask)
* Slack (Cask)
* Tunnelblick (Cask)
* Vagrant (Cask)

#### Buildit Java Based Tools

This Cask is intended to install the Java based tools/environments.

---


###### Note

Unfortunately there is a chicken-and-egg situation for this Cask. 
Maven, Gradle and Tomcat Formulas require that a Java 1.7+ is already installed in the system. Even though this Cask list the Java dependencies,
these are not taken into consideration (i.e. installed) before all Formula dependencies are solved. 
So to solve this problem it is necessary to install any java version using brew manually before the installation of this Cask i.e. ``brew cask install java``

---

###### Requisites:
As this Cask will install different versions of JDK, it is necessary to add a new Tap to Homebrew, to make
versions that are not the latest ones available:

```
brew tap caskroom/versions
```


###### Installation 
After including the versions Tap, the *buildit-java-based-tools* Cask can be installed using the command:

```
brew cask install buildit-java-based-tools
```

###### Contents

The following Casks and Formulas will be installed:
* Maven (Formula)
* Gradle (Formula)
* Tomcat (Formula)
* Java 9 (Cask)
* Java 8 (Cask)
* Java 7 (Cask) - using [Azul Systems](https://www.azul.com/downloads/zulu/) JDK, as Oracle one is not available as a Cask anymore. 
More info [here](https://github.com/caskroom/homebrew-versions/pull/3914).

## Installation limitations

It is important to note that if any of the above Casks have already been installed outside of Homebrew environment, 
it will break the installation (default behaviour for any Cask).

The information about manual steps needed is displayed as Homebrew *Caveats*. Unfortunately this information
is shown before the installation, so if there is the need to check what needs to configure after the installation finishes, 
just run the commands below accordingly:

```
brew cask info buildit-base-tools
brew cask info buildit-java-based-tools
```

## Contributing

If you are interested in contributing to this project, please: 
* Fork this repo; 
* make your changes; 
* submit a PR.

We will try to review and give feedback as quickly as possible.