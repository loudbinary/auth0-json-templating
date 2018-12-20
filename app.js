let App = require('./libs/index.js');
let app = new App({opt1:"options1"});
app.utils.parseDirectories('C:\\git\\com.dartfleet.auth0\\tenant_template')
    .then(directoryTree =>  app.utils.createTemplateSkeleton(directoryTree))
    .then(templateObject => app.utils.readJsonIntoObject(templateObject))
    .then(templateList => app.utils.replaceStringValues(templateList))
    .then(templateList => app.utils.replaceArrayValues(templateList))
    .catch(e =>{
        console.log(e)
    })