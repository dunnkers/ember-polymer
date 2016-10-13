# ember-polymer [![Build Status](https://travis-ci.org/dunnkers/ember-polymer.svg?branch=master)](https://travis-ci.org/dunnkers/ember-polymer)

Be cool and use [Polymer](https://www.polymer-project.org/1.0/) and Ember together!
This addon integrates Polymer with Ember, so you can use the power of custom web
components in your ember apps today.

## Requirements

This addon forces Polymer to use Shadow DOM. Browsers that do not natively support Shadow DOM will be supplied with the polyfill. Note that using a polyfilled Shadow DOM
results in slightly slower rendering.

## Installation

`ember install ember-polymer`

## Usage

To use a custom element, you will have to first install it through bower. e.g.

`bower install PolymerElements/paper-button --save`

We now need to import the element. Add a file `elements.html` in `/app` with the following:

```html
<link rel="import" href="../bower_components/paper-button/paper-button.html">
```

That's it! You should now be able to use the `<paper-button>` element in all its glory!

## Demo

[https://dunnkers.github.io/ember-polymer/](https://dunnkers.github.io/ember-polymer/)

## Configuration

The addon can be configured in the `config/environment.js` file as such:

```js
ENV['ember-polymer'] = {
  option: 'value'
}
```

**htmlImportsFile**

Defaults to `app/elements.html`. The file that html imports are done in, and is
used by the addon to [vulcanize](https://github.com/Polymer/vulcanize).

```js
  htmlImportsFile: 'app/elements.html'
```

**vulcanizeOutput**

Defaults to `assets/vulcanized.html`. The output file for all vulcanized
html code and styling.

```js
  vulcanizeOutput: 'assets/vulcanized.html'
```

**vulcanizeOptions**

Allows you to set
[options](https://github.com/Polymer/vulcanize#using-vulcanize-programmatically)
used in vulcanize. Defaults to:

```js
  vulcanizeOptions: {
    inlineCss: true
  }
```

## About

This addon was sponsored by [Fabriquartz](http://www.fabriquartz.com/), a startup
based in The Netherlands.
