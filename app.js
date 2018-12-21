let App = require('./libs/index.js');
let app = new App({opt1:"options1"});
const templateDirectory="/Users/charles.russell/droneup1/com.dartfleet.auth0/tenant_template"
const saveDirectory="/Users/charles.russell/Loudbinary/saveDirectoryAuth0Templates"

app.utils.parseDirectories(templateDirectory)
    .then(directoryTree =>  app.utils.createTemplateSkeleton(directoryTree))
    .then(templateObject => app.utils.readJsonIntoObject(templateObject))
    .then(templateList => app.utils.replaceDelimetedText(templateList))
    .then(templateList => app.utils.saveTemplateList(templateList,templateDirectory,saveDirectory))
    .catch(e =>{
        console.log(e)
    })