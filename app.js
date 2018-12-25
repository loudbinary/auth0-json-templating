#!/usr/bin/env node
let App = require('./libs/index.js');
let app = new App();
//const templateDirectory="/Users/charles.russell/droneup1/com.dartfleet.auth0/tenant_template"
//const saveDirectory="/Users/charles.russell/Loudbinary/saveDirectoryAuth0Templates"

app.processArgs(()=>{
    templateDirectory = app.options.templateDirectory
    saveDirectory = app.options.saveDirectory
    app.utils.parseDirectories(templateDirectory)
    .then(directoryTree =>  app.utils.createTemplateSkeleton(directoryTree))
    .then(templateObject => app.utils.readJsonIntoObject(templateObject))
    .then(templateList => app.utils.replaceDelimetedText(templateList))
    .then(templateList => app.utils.saveTemplateList(templateList,templateDirectory,saveDirectory))
    .then(() => app.utils.copyRemaining(templateDirectory,saveDirectory))
    .catch(e =>{
        app.utils.printHelp
    })
})
