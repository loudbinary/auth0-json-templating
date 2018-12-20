// My module
const Utils = require('./utils')
function App(options) {
    this.options = options
    this.utils = new Utils()
  }
  
  App.prototype.foo = function foo() {
    console.log(this.bar);
  };
  
  module.exports = App;