# BRAINWASH
A fun stereotype and prejudice reduction tool for your smartphone.

##Content

The Brainwash app is free software, released under the [GPLv3](https://www.gnu.org/licenses/gpl-3.0.html).

Images of people used in the app are mostly pictures with CC licenses taken from flickr. Details can be found in a file `attribution.txt` next to the image files.

##Building

BRAINWASH is built using the [Ionic v2 framework](http://ionicframework.com/) with [Cordova](https://cordova.apache.org/), so you first need to [install the tooling.](http://ionicframework.com/docs/v2/getting-started/installation/)

Beyond Ionic and Cordova, you must install the SDK for the phone platform you are building for.

Next, fetch the source code from this repo and install it's dependencies using `npm install`.

Brainwash is mostly Typescript and HTML 5. Install [typings](https://github.com/typings/typings/) so that we can use [lodash](https://lodash.com/) and other plain javascript libraries.

This is what it will look like on your command line:

```
# ----> Install tooling
$ sudo npm install -g ionic@beta
$ sudo npm install -g cordova
$ sudo npm install -g typings

# ----> Prep project
$ git clone https://github.com/forskningsfronten/brainwash.git
$ cd brainwash
$ npm install
$ typings install

# ----> Build for android
$ ionic add platform android
$ ionic build/run android
``` 

##Hacking

I recommend using the [Atom](https://atom.io/) editor with the [ionic-preview plugin](https://atom.io/packages/ionic-preview/), to get a live reloading emulator next to the code.

* Application logic, ui templates and tests are found in the `app/pages` directory. 
* Images and other static resources are found in the `www/` directory. 
* Some general theming SASS stuff is found in the `app/theme` directory.

