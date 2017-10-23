import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | about');

test('renders custom elements -> vulcanized.html is loaded correctly', function(assert) {
  visit('/about');
  assert.expect(3);

  andThen(function() {
    assert.equal(currentURL(), '/about');
  });

  andThen(function() {
    let done = assert.async();

    let testElement = () => {
      let button = document.querySelector('paper-button');

      assert.ok(button.shadowRoot || button.shadyRoot,
        'paper-button has shadowRoot');

      assert.equal(Ember.$('paper-button').attr('role'), 'button',
        'paper-button rendered successfully');

      done();
    };

    if (window.Polymer.Settings.nativeShadow || window.WebComponents.ready) {
      testElement();
    } else {
      // wait for elements to be polyfilled
      window.addEventListener('WebComponentsReady', testElement);
    }
  });
});
