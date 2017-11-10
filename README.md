# ember-polymer
[![Build Status](https://travis-ci.org/dunnkers/ember-polymer.svg?branch=master)](https://travis-ci.org/dunnkers/ember-polymer) [![Ember Observer Score](https://emberobserver.com/badges/ember-polymer.svg)](https://emberobserver.com/addons/ember-polymer)  [![Coverage Status](https://coveralls.io/repos/github/dunnkers/ember-polymer/badge.svg?branch=master)](https://coveralls.io/github/dunnkers/ember-polymer?branch=master)

Be cool and use [Polymer](https://www.polymer-project.org) and Ember together! This addon integrates Polymer with Ember, so you can use the power of custom web components in your ember apps today.

### Polymer 2.0

This addon has been updated to for Polymer 2.0! Still want 1.0? Check out the [1.x branch](https://github.com/dunnkers/ember-polymer/tree/1.0).

## Why

Why use Polymer? You might ask. By using Polymer you actually choose to embrace the native Web Components specification, not necessarily Polymer itself. Polymer is only just a thin layer over the [Custom Elements v1 specification](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), providing some syntactic sugar as well as [compatibility](https://www.polymer-project.org/2.0/docs/browsers). Every framework will eventually end up implementing this specification somehow, simply because using native is faster.

Polymer enables you to use any element on [webcomponents.org](https://www.webcomponents.org), opening up the world to lots of other good quality components besides the ones on emberaddons.com.

## Installation

```shell
ember install ember-polymer
```

## Usage

To use a custom element, just install it through bower.

```shell
bower install PolymerElements/paper-button --save
```

Done! ember-polymer identifies this package as a custom element and imports it automatically! ✨ You can now use the element:

```html
<paper-button raised>Raised button</paper-button>
```

## Demo

[https://dunnkers.github.io/ember-polymer/](https://dunnkers.github.io/ember-polymer/)

## Data binding

Polymer's elements should just work with one-way bindings:
```html
<paper-button raised={{raised}}>Raised button</paper-button>
```
However, for two-way bindings we will need to encapsulate the elements in an Ember Component. Exactly this is what the [ember-polymer-paper](https://github.com/dunnkers/ember-polymer-paper) addon is for!

## Requirements

This addon forces Polymer to use Shadow DOM. Browsers that do not natively support Shadow DOM will be supplied with the [polyfill](https://github.com/webcomponents/webcomponentsjs). Note that this polyfill might result in slightly slower rendering.

## Configuration

### Manual imports

If an element is not automatically imported, it probably does not follow the polymer [naming conventions](https://www.polymer-project.org/1.0/docs/tools/polymer-cli#element-project-layout). To import it, create `elements.html` in `/app` and import the element:

```html
<link rel="import" href="../bower_components/some-element/some-element.html">
```

### Config variables

The addon can be configured in `config/environment.js` as such:

```js
ENV['ember-polymer'] = {
  option: 'value'
}
```

#### autoElementImport

Indicates whether elements should be imported automatically. ember-polymer automatically imports elements from bower and npm packages which have the `web-components` keyword and a valid [html import entry point](https://www.polymer-project.org/1.0/docs/tools/polymer-cli#element-project-layout). All elements at [customelements.io](https://customelements.io/) should be compatible.

Disable if you want full control over imports yourself. Defaults to `true`.

```js
  autoElementImport: true
```

#### excludeElements

A list with names of bower- or npm packages to exclude during auto element import. Comes in handy when you only want to manually import one specific file from a package, but not the entire element.

Defaults to `[]`.

```js
  excludeElements: ['paper-styles']
```

#### htmlImportsFile

File to put html imports in. If you do not have manual imports and are using `autoElementImport`, the file is not necessary.

Defaults to `app/elements.html`.

```js
  htmlImportsFile: 'app/elements.html'
```

#### bundlerOptions

Allows you to set [options](https://github.com/Polymer/polymer-bundler#using-polymer-bundler-programmatically) used in [polymer-bundler](https://github.com/Polymer/polymer-bundler).

Defaults to:

```js
  bundlerOptions: {
    inlineCss: true,
    inlineScripts: true
  }
```

#### bundlerOutput

The output file produced by [polymer-bundler](https://github.com/Polymer/polymer-bundler) for all bundled html code and styling.

Defaults to `assets/bundled.html`.

```js
  bundlerOutput: 'assets/bundled.html'
```

#### polyfillBundle

The polyfill bundle to use. Can be one of `hi`, `hi-ce`, `hi-sd-ce`, `sd-ce`, `lite` or `none` for no polyfills. See the webcomponentsjs [how-to-use](https://github.com/webcomponents/webcomponentsjs#how-to-use) page.

Defaults to `lite`.

```js
  polyfillBundle: 'lite'
```

## About

This addon was sponsored by [Fabriquartz](http://www.fabriquartz.com/), a startup based in The Netherlands.
