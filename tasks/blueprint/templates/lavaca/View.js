let View = require('lavaca/mvc/View');
var template = require('rdust!templates/<%=templateFolder%><%= className %><%=postfix%>');

/**
 * @class <%= classDotNotation %>
 * @super lavaca.mvc.View
 * <%= className %><%=postfix%> view type
 */
module.exports = View.extend(function <%= className %><%=postfix%>(){
  View.apply(this, arguments);
},{
  /**
  * @field {String} className
  * @default '<%=classNameLowerCase %>'
  * A class name added to the view container
  */
  className: '<%=classNameLowerCase %>',
  generateHtml: function(model) {
    return new Promise(function(resolve) {
      template.render(model, function(err, html) {
        resolve(html);
      });
    });
  }


});
