/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-polymer',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import(app.bowerDirectory + '/webcomponentsjs/webcomponents.min.js');
  },

  // insert polymer and vulcanized elements
  contentFor: function(type) {
    if (type === 'head') {
      var str = '<script>window.Polymer = window.Polymer || {};';
      // (!) shadow DOM is required for Polymer and Ember to interoperate
      str += 'window.Polymer.dom = "shadow";</script>';
      return str;
    }
  }
};
