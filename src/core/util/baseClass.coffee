csextends = require('csextends')
# Base class for all project classes. Contains only the extends method to ensure js programmers can easily use the library
class BaseClass
  # Create a new class extending the current
  # @param [Object] options extending options
  # @example How to instantiate any library class (in Javascript)
  #   var HelloWorldClass = BaseClass.extends({
  #               sayHello: function(){console.log('HELLO WORLD');}
  #             });
  #   var helloObject = new HelloWorldClass();
  #   helloObject.sayHello(); // print HELLO WORLD
  @extends:(options)->csextends(@,options)

module.exports = BaseClass
