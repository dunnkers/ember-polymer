# ember-polymer
[![Build Status](https://travis-ci.org/dunnkers/ember-polymer.svg?branch=master)](https://travis-ci.org/dunnkers/ember-polymer) [![Ember Observer Score](https://emberobserver.com/badges/ember-polymer.svg)](https://emberobserver.com/addons/ember-polymer)  [![Coverage Status](https://coveralls.io/repos/github/dunnkers/ember-polymer/badge.svg?branch=master)](https://coveralls.io/github/dunnkers/ember-polymer?branch=master)

Be cool and use [Polymer](https://www.polymer-project.org/1.0/) and Ember together! This addon integrates Polymer with Ember, so you can use the power of custom web components in your ember apps today.

## Requirements

This addon forces Polymer to use Shadow DOM. Browsers that do not natively support Shadow DOM will be supplied with the [polyfill](https://github.com/webcomponents/webcomponentsjs). Note that using a polyfilled Shadow DOM results in slightly slower rendering.

## Installation

`ember install ember-polymer`

## Usage

To use a custom element, just install it through bower.

`bower install PolymerElements/paper-button --save`

Done! ember-polymer detects that this is a custom element, and imports it automatically! ✨ You can now use the element:

```html
<paper-button raised>Raised button</paper-button>
```

#### Manual import

If your element is not automatically imported, its folder structure does not follow the polymer [guidelines](https://www.polymer-project.org/1.0/docs/tools/documentation#add-a-documentation-page-for-an-element-repo). To manually import this element, add a file `elements.html` in `/app`, and import the custom element:

```html
<link rel="import" href="../bower_components/some-element/some-element.html">
```

Automatic imports and manual imports will then be merged.

To disable automatic element importing all together, set the `autoElementImport` config variable to `false`.

## Demo

[https://dunnkers.github.io/ember-polymer/](https://dunnkers.github.io/ember-polymer/)

## Configuration

The addon can be configured in the `config/environment.js` file as such:

```js
ENV['ember-polymer'] = {
  option: 'value'
}
```

**autoElementImport**

This indicates whether elements should be imported automatically. ember-polymer finds elements  by looking through bower and npm packages, and then checks whether the package has the `web-components` keyword and a valid html import entry point. See the [guidelines](https://www.polymer-project.org/1.0/docs/tools/documentation#add-a-documentation-page-for-an-element-repo). Defaults to `true`.

```js
  autoElementImport: true
```

**excludeElements**

A list with names of bower- or npm packages to exclude during auto element import. Defaults to `[]`.

```js
  excludeElements: ['paper-styles']
```

**htmlImportsFile**

File to put html imports in. File is not necessary if using `autoElementImport` and no additional elements are needed to import. If defined anyway, imports in the file will be merged with the auto imported ones.

If not using `autoElementImport`, the file must exist. Defaults to `app/elements.html`.

```js
  htmlImportsFile: 'app/elements.html'
```

**vulcanizeOutput**

The output file produced by [vulcanize](https://github.com/Polymer/vulcanize) for all vulcanized html code and styling. Defaults to `assets/vulcanized.html`.

```js
  vulcanizeOutput: 'assets/vulcanized.html'
```

**vulcanizeOptions**

Allows you to set
[options](https://github.com/Polymer/vulcanize#using-vulcanize-programmatically)
used in vulcanize. Defaults to:

```js
  vulcanizeOptions: {
    inlineCss: true,
    inlineScripts: true
  }
```

## About

This addon was sponsored by [Fabriquartz](http://www.fabriquartz.com/), a startup based in The Netherlands.
