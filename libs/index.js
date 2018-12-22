// My module
const Utils = require('./utils')
var program = require('commander');
const _ = require('lodash')

App.prototype.processArgs = function processArgs(next){
  program
  .version('0.1.0')
  .option('-t, --templateDirectory [directory]', 'Auth0 Template Directory')
  .option('-s, --saveDirectory [directory]', 'Directory to save Auth0 Tenant configuration')
  .options('-e, --envFile [.env]', 'Env file to load variables from')
  .parse(process.argv);

  console.log('Executing with settings:');
  if (program.templateDirectory) console.log(' - Template Directory:',program.templateDirectory);
  if (program.saveDirectory) console.log(' - Save Directory:',program.saveDirectory);
  if (program.envFile) require('dotenv').config({ path: program.envFile })
  _.merge(this.options,program)
  next()
}

function App(options) {
    this.options = options || {}
    this.utils = new Utils()
  }

  module.exports = App;