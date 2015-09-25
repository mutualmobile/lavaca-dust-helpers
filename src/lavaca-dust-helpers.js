define(function(require) {

  var dust = require('dust');
  require('dust-helpers');

  dust.helpers = dust.helpers || {};

  /**
   * Helper function, exposed in dust templates, that uses
   *   [[Lavaca.ui.Template]] to include other templates. Accessed as:
   *
   * <dl>
   *
   * <dt>{@include name="template-name"/}</dt>
   *   <dd>name&mdash;The name under which the template can be referenced</dd>
   *
   * </dl>
   *
   * <strong>Note:</strong> You should always use the include helper instead of
   * the dust.js partial syntax. The dust.js partial syntax may not work as expected.
   *
   * @method helperInclude
   * @param {Object} chunk  Dust chunk
   * @param {Object} context  Dust context
   * @param {Object} bodies  Dust bodies
   * @param {Object} params  Parameters passed to the helper
   * @return {String}  Rendered output
   */
  dust.helpers.include = function(chunk, context, bodies, params) {
    var name = dust.helpers.tap(params.name, chunk, context),
        result;

    // dust is the "asynchronous" template language... which doesn't allow its
    // helpers to be asynchronous. I'm duplicating code from
    // DustTemplate#render to avoid the Promise wrapper (which per the
    // es6 spec must operate on a different turn of the event loop for each `.then`).
    // The dust.render callback is also on a different turn of the event loop via
    // setTimeout(0), but all calls within the same turn of the event
    // loop will be in sequence (effectively synchronous) on the next turn.
    dust.render(name, context.stack.head, function(err, html) {
      result = html;
    });

    return chunk.write(result);
  };

});
