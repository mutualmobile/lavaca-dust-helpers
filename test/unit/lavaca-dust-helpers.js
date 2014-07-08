define(function(require) {

  var $ = require('$');
  var Translation = require('lavaca/util/Translation');
  var Config = require('lavaca/util/Config');
  require('dust');
  require('src/lavaca-dust-helpers');

  function _newTranslation(code) {
    $('body').append('<script type="text/x-translation" data-name="en_US" class="script-translation">' + code + '</script>');
    Translation.init('en_US');
  }

  describe('lavaca-dust-helpers', function() {

    it('can use a translation', function() {
      var source = '{@msg key="test-value"/}',
          context = {};

      _newTranslation('{"test-value": "hello world"}');
      dust.loadSource(dust.compile(source, 'testTemplate'));
      dust.render('testTemplate', context, function(err, html) {
        expect(html).toEqual('hello world');
      });
      Translation.dispose();
    });

    it('can use an include', function() {
      var source = '<h2>{title}</h2>',
          parentSource = '<h1>{name}</h1>{@include name="titleTemplate"/}',
          context = {name: 'Larry', title: 'Developer'};

      dust.loadSource(dust.compile(source, 'titleTemplate'));
      dust.loadSource(dust.compile(parentSource, 'testTemplate'));
      dust.render('testTemplate', context, function(err, html) {
        expect(html).toEqual('<h1>Larry</h1><h2>Developer</h2>', 'titleTmpl');
      });
    });

    it('can reference a variable from a config file', function() {
      var source = '<p>{@config key="test_key" environment="test-environment" /}</p>',
          context = {};

      $('body').append('<script type="text/x-config" data-name="test-environment" id="temp-config-script">{"test_key": "test value"}</script>');
      Config.init();

      dust.loadSource(dust.compile(source, 'testTemplate'));
      dust.render('testTemplate', context, function(err, html) {
        expect(html).toEqual('<p>test value</p>');
      });
      Config.dispose();
      $('#temp-config-script').remove();
    });

    it('can selectively render content based on current config environment', function() {
      var source = '<p>{@config only="test-local"}Yes{:else}No{/config}</p>' +
        '<p>{@config only="test-staging"}Yes{:else}No{/config}</p>' +
        '<p>{@config only="test-production"}Yes{:else}No{/config}</p>' +
        '<p>{@config not="test-local"}Yes{:else}No{/config}</p>' +
        '<p>{@config not="test-staging"}Yes{:else}No{/config}</p>' +
        '<p>{@config not="test-production"}Yes{:else}No{/config}</p>',
      context = {};

      $('body').append('<script type="text/x-config" data-name="test-local" class="test-configs">{"test_key": "test-local"}</script>');
      $('body').append('<script type="text/x-config" data-name="test-staging" class="test-configs">{"test_key": "test-staging"}</script>');
      $('body').append('<script type="text/x-config" data-name="test-production" class="test-configs">{"test_key": "test-production"}</script>');
      Config.init();

      // Test first environment
      Config.setDefault('test-local');
      dust.loadSource(dust.compile(source, 'testTemplate'));
      dust.render('testTemplate', context, function(err, html) {
        expect(html).toEqual('<p>Yes</p><p>No</p><p>No</p><p>No</p><p>Yes</p><p>Yes</p>');
      });

      // Test second environment
      Config.setDefault('test-production');
      dust.render('testTemplate', context, function(err, html) {
        expect(html).toEqual('<p>No</p><p>No</p><p>Yes</p><p>Yes</p><p>Yes</p><p>No</p>');
      });

      Config.dispose();
      $('script.test-configs').remove();
    });

  });

});
