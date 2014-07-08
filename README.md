lavaca-dust-helpers
===================

lavaca-dust-helpers is a small collection of [dust
helpers](https://github.com/linkedin/dustjs/wiki/Dust-Tutorial#Helpers) which
provide integration with the [Lavaca
framework](https://github.com/mutualmobile/lavaca). They are:


dust.helpers.msg
----------------

Helper function that uses `lavaca/util/Translation` to get localized strings.
Accessed as:

`{@msg key="code"/}`

* *code* - The key under which the message is stored

`{@msg key="code"}default{/msg}`

* *code* - The key under which the message is stored
* *default* - The default markup to display if no translation is found


`{@msg key="code" locale="en_US"/}`

* *code* - The key under which the message is stored
* *locale* - The locale from which to get the message ("en_US")

`{@msg key="code" p0="first" p1=variable /}`

* *code* - The key under which the message is stored
* *p0, p1, ... pN* - String format parameters for the message (See
  `lavaca/util/StringUtils.format()`)


dust.helpers.include
--------------------

Helper function that includes other dust templates.  Accessed as:

`{@include name="template-name"/}`

* *name* - The name under which the template can be referenced


dust.helpers.config
-------------------

Helper function that allows templates to use data from `lavaca/util/Config`.
Accessed as:

`{@config key="config_value"/}`

* *key* - The key to read from the config file for the default environment.

`{@config key="config_value" environment="production"/}`

* *key* - The key to read from the config file for the specified environment.

`{@config key="config_value"}default{/config}`

* *key* - The key to read from the config file
* *default* - The default markup to display if the key is not found

`{@config key="config_value" p0="first" p1=variable /}`

* *key* - The key to read from the config file
* *p0, p1, ... pN* - String format parameters (See
  `lavaca/util/StringUtils.format()`)

`{@config only="local"}...{:else}...{/config}`

* *only* - Only render the body content if the current config environment's name matches this key

`{@config not="production"}...{:else}...{/config}`

* *not* - Only render the body content if the current config environment's name does NOT match this key
