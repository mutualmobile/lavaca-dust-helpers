define(function(require) {

  var dust = require('dust'),
    Config = require('lavaca/util/Config'),
    StringUtils = require('lavaca/util/StringUtils'),
    Translation = require('lavaca/util/Translation');
  require('dust-helpers');

  dust.helpers = dust.helpers || {};

  /**
   * Helper function, exposed in dust templates, that uses
   *   [Lavaca.util.Translation] to get localized strings.
   * Accessed as:
   *
   * <dl>
   *
   * <dt>{@msg key="code"/}</dt>
   *   <dd>code&mdash;The key under which the message is stored</dd>
   *
   * <dt>{@msg key="code"}default{/msg}</dt>
   *   <dd>code&mdash;The key under which the message is stored</dd>
   *   <dd>default&mdash;The default markup to display if no translation
   *       is found</dd>
   *
   *
   * <dt>{@msg key="code" locale="en_US"/}</dt>
   *   <dd>code&mdash;The key under which the message is stored</dd>
   *   <dd>locale&mdash;The locale from which to get the message ("en_US")</dd>
   *
   * <dt>{@msg key="code" p0="first" p1=variable /}</dt>
   *   <dd>code&mdash;The key under which the message is stored</dd>
   *   <dd>p0, p1, &hellip; pN&mdash;String format parameters for the message
   *       (See [[Lavaca.util.StringUtils]].format())</dd>
   *
   * </dl>
   *
   * @method helperMsg
   *
   * @param {Object} chunk  Dust chunk
   * @param {Object} context  Dust context
   * @param {Object} bodies  Dust bodies
   * @param {Object} params  Parameters passed to the helper
   * @return {String}  Rendered output
   */
  dust.helpers.msg = function(chunk, context, bodies, params) {
    var key = dust.helpers.tap(params.key, chunk, context),
        locale = dust.helpers.tap(params.locale, chunk, context),
        translation = Translation.get(key, locale),
        args = [translation],
        i = -1,
        arg;
    if(!translation) {
      return bodies.block ? chunk.render(bodies.block, context) : chunk;
    }
    arg = params['p' + (++i)];
    while (typeof arg !== 'undefined') {
      args.push(dust.helpers.tap(arg, chunk, context));
      arg = params['p' + (++i)];
    }
    return chunk.write(StringUtils.format.apply(this, args));
  };

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

  /**
   * Helper function, exposed in dust templates, that allows templates
   *   to use data from [[Lavaca.util.Config]]. Accessed as:
   *
   * <dl>
   *
   * <dt>{@config key="config_value"/}</dt>
   *   <dd>key&mdash;The key to read from the config file for the default environment.</dd>
   *
   * <dt>{@config key="config_value" environment="production"/}</dt>
   *   <dd>key&mdash;The key to read from the config file for the specified environment.</dd>
   *
   * <dt>{@config key="config_value"}default{/config}</dt>
   *   <dd>key&mdash;The key to read from the config file</dd>
   *   <dd>default&mdash;The default markup to display if the key
   *       is not found</dd>
   *
   * <dt>{@config key="config_value" p0="first" p1=variable /}</dt>
   *   <dd>key&mdash;The key to read from the config file</dd>
   *   <dd>p0, p1, &hellip; pN&mdash;String format parameters
   *       (See [[Lavaca.util.StringUtils]].format())</dd>
   *
   * </dl>
   *
   * <dt>{@config only="local"}&hellip;{:else}&hellip;{/config}</dt>
   *   <dd>only&mdash;Only render the body content if the current config environment's name matches this key</dd>
   *
   * </dl>
   *
   * <dt>{@config not="production"}&hellip;{:else}&hellip;{/config}</dt>
   *   <dd>not&mdash;Only render the body content if the current config environment's name does NOT match this key</dd>
   *
   * </dl>
   * @method helperConfig
   *
   * @param {Object} chunk  Dust chunk
   * @param {Object} context  Dust context
   * @param {Object} bodies  Dust bodies
   * @param {Object} params  Parameters passed to the helper
   * @return {String}  Rendered output
   */
  dust.helpers.config = function(chunk, context, bodies, params) {
    var key = dust.helpers.tap(params.key, chunk, context),
        environment = dust.helpers.tap(params.environment, chunk, context),
        value = environment ? Config.get(environment, key) : Config.get(key),
        args = [value],
        i = -1,
        currentEnvironment, arg;
    if(params.only || params.not) {
      currentEnvironment = Config.currentEnvironment();
      if((params.only && currentEnvironment === params.only) || (params.not && currentEnvironment !== params.not)) {
        return bodies.block ? chunk.render(bodies.block, context) : chunk;
      } else {
        return bodies['else'] ? chunk.render(bodies['else'], context) : chunk;
      }
    }
    if(!value) {
      return bodies.block ? chunk.render(bodies.block, context) : chunk;
    }
    arg = params['p' + (++i)];
    while (typeof arg !== 'undefined') {
      args.push(dust.helpers.tap(arg, chunk, context));
      arg = params['p' + (++i)];
    }
    return chunk.write(StringUtils.format.apply(this, args));
  };

});