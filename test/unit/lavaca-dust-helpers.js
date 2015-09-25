define(function(require) {

  var $ = require('$');
  require('dust');
  require('src/lavaca-dust-helpers');

  describe('lavaca-dust-helpers', function() {

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

  });

});
