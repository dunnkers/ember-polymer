import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import $ from 'jquery';

module('Acceptance | about', function(hooks) {
  setupApplicationTest(hooks);

  test('renders custom elements -> bundled.html is loaded correctly', async function(assert) {
    await visit('/about');
    assert.expect(3);

    assert.equal(currentURL(), '/about');
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
