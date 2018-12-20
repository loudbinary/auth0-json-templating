var fs = require('fs');
var path = require('path');
let _ = require('lodash')
let fse = require('fs-extra')
let results = []
const mapKeysDeep = require('map-keys-deep-lodash');

function getFiles(dir){
    var files = fs.readdirSync(dir);
    return files.filter(f=>{
        if (f.indexOf(".json") >0) return f
    })
}
function getDirectories(dir,dirList){
    dirList = dirList || [];
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        if (fs.statSync(name).isDirectory()){
            dirList.push(name)
            getDirectories(name, dirList);
        }
    }
    return dirList;
}

function buildTemplateObject(directories){
    let results = {}
    _.forEach(directories,el =>{
        let baseName = path.basename(el)
        let parentName = path.basename(path.dirname(el))

        if (typeof results[parentName] !== 'undefined'){
            results[parentName][baseName] = {}
        } else [
            results[baseName] = {}
        ]
    })

    return results
}

function buildResult(dirName){
    let _dirName = dirName
    let directories = getDirectories(dirName)
    let templateObject = buildTemplateObject(directories)
    _.map(templateObject,(f,dir)=>{
        let files = getFiles(path.join(templateDir,dir))
        files.forEach((file,key) =>{
            templateObject[dir][file] = fse.readJSONSync(path.join(templateDir,dir,file))
        })
    })
    _.every(templateObject,t=>{
        console.log(t)
    })
}
const templateDir="/Users/charles.russell/droneup1/com.dartfleet.auth0/tenant_template"
buildResult(templateDir)
