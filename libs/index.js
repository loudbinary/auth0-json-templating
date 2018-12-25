// My module
const Utils = require('./utils')
var program = require('commander');
const _ = require('lodash')

App.prototype.processArgs = function processArgs(next){
  program
  .version('0.1.0')
  .option('-t, --templateDirectory [directory]', 'Auth0 Template Directory')
  .option('-s, --saveDirectory [directory]', 'Directory to save Auth0 Tenant configuration')
  .parse(process.argv);

  if (program.templateDirectory) console.log(' - Template Directory:',program.templateDirectory);
  if (program.saveDirectory) console.log(' - Save Directory:',program.saveDirectory);
  _.merge(this.options,program)
  next()
}

function printHelp(){
  console.log('')
  console.log('Required Arguments:');
  console.log('  (-t) --templateDirectory <path to auth0 templates>');
  console.log('  (-s) --saveDirectory <path to save filled out template>');
}

function App(options) {
    this.options = options || {}
    this.utils = new Utils()
    this.printHelp = printHelp()
  }

  module.exports = App;