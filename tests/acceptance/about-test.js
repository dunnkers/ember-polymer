import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | about');

test('renders custom elements -> vulcanized.html is loaded', function(assert) {
  visit('/about');

  andThen(function() {
    assert.equal(currentURL(), '/about');
  });

  andThen(function() {
    let done = assert.async();

    let testElement = () => {
      assert.ok(document.querySelector('paper-button').shadowRoot,
        'paper-button has shadowRoot');
      assert.equal($('paper-button').attr('role'), 'button',
        'paper-button rendered successfully');

      done();
    };

    if (window.Polymer.Settings.nativeShadow ||
        window.Polymer.RenderStatus.hasRendered()) {
      testElement();
    } else {
      // wait for elements to be polyfilled
      window.addEventListener('WebComponentsReady', testElement);
    }
  });
});
