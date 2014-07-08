require.config({
  baseUrl: './',
  paths: {
	'es5-shim': 'bower_components/es5-shim/es5-shim',
	'$': 'bower_components/jquery/jquery',
	'jquery': 'bower_components/jquery/jquery',
	'mout': 'bower_components/mout/src',
	'dust': 'bower_components/dustjs-linkedin/dist/dust-full-2.0.3',
	'dust-helpers': 'bower_components/dustjs-linkedin-helpers/dist/dust-helpers-1.1.1',
	'rdust': 'bower_components/require-dust/require-dust',
	'iScroll': 'bower_components/iscroll/dist/iscroll-lite-min',
	'lavaca': 'bower_components/lavaca/src'
  },
  shim: {
	$: {
	  exports: '$'
	},
	jquery: {
	  exports: '$'
	},
	dust: {
	  exports: 'dust'
	},
	'dust-helpers': {
	  deps: ['dust']
	},
	templates: {
	  deps: ['dust']
	}
  }
});
require(['es5-shim']);
require(['app/app']);
