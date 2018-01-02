import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import $ from 'jquery';

moduleForAcceptance('Acceptance | Polymer | index');

test('renders custom elements', function(assert) {
  visit('/');
  assert.expect(3);

  andThen(function() {
    assert.equal(currentURL(), '/');
  });

  andThen(function() {
    let done = assert.async();

    let testElement = () => {
      let button = document.querySelector('paper-button');

      assert.ok(button.shadowRoot || button.shadyRoot,
        'paper-button has shadowRoot');

      assert.equal($('paper-button').attr('role'), 'button',
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
