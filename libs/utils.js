// My module
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const dirTree = require('directory-tree')
const _ = require('lodash')
function Utils() {
    this.name = "utils"
}

function getJsonChildren(children, child) {
    if (child && child.children) {
        children.push(getJsonChildren([], child.children))
    } else {
        children.push(child);
    }
    return children;
}

function loadEnvkeyValues(){
    return new Promise((resolve,reject)=>{
        try{
            if (process.env.ENVKEY){
                console.log('Loading envkey values into process...')
                require('envkey')
                resolve(null)
            } else {
                resolve(null)
            }
        }
        catch(e){
            reject(e)
        }
    })
}

Utils.prototype.replaceArrayValues = function replaceArrayValues(templateList){
    return new Promise((resolve,reject)=>{
        let results = templateList
        _.map(results,f =>{
            _.map(f.json,(v,k) =>{
                if (_.startsWith(v,"@@")  &&  _.endsWith(v,"@@")){
                    keyName = _.split(v,"@@")[1]
                    if (process.env[keyName]){
                        f.json[k] = []
                        _.forEach(process.env[keyName].split(","),v =>{
                            f.json[k].push(v.trimLeft().trimRight())
                        })
                    } else {
                        reject('Missing environment key:',v)
                    }
                }
            })
        })
        resolve(results)
    })
}

Utils.prototype.replaceStringValues = function replaceStringValues(templateList){
    return new Promise((resolve,reject)=>{
        loadEnvkeyValues()
            .then(()=>{
                _.forEach(templateList,f =>{
                    _.map(f.json,(v,k) =>{
                        if (_.startsWith(v,"##")  &&  _.endsWith(v,"##")){
                            keyName = _.split(v,"##")[1]
                            if (process.env[keyName]){
                                f.json[k] = process.env[keyName].trimLeft().trimRight()
                            } else {
                                reject('Missing environment key:',v)
                            }
                        }
                    })
                })
                resolve(templateList)
            })
    })
}

function getKeyName(keyValue,delimeter){
    leftside = keyValue.indexOf(delimeter)
    substr = keyValue.substring(leftside + 2)
    rightside = substr.indexOf(delimeter)
    keyname = substr.substring(0,rightside)
    keyValue.substring(0,)
    return keyname
}


function mapDeep( obj ) {
    for ( var prop in obj ) {
        if ( obj[prop] === String(obj[prop]) ){
            if (obj[prop].indexOf("##")>=0){
                keyname = getKeyName(obj[prop],"##")
                if (process.env[keyname]){
                    obj[prop] = obj[prop].replace("##" + keyname + "##",process.env[keyname].trimLeft().trimRight())
                } else {
                    console.log('Missing environment key:',keyname)
                }
            }
            if (obj[prop].indexOf("@@")>=0){
                keyname = getKeyName(obj[prop],"@@")
                if (process.env[keyname]){
                    obj[prop] = []
                    _.forEach(process.env[keyname].split(","),v =>{
                        obj[prop].push(v.trimLeft().trimRight())
                    })
                } else {
                    console.log('Missing environment key:',keyname)
                }
            }
        }
        else if ( obj[prop] === Object(obj[prop]) ) mapDeep( obj[prop] );
    }
};
Utils.prototype.saveTemplateList = function saveTemplateList(templateList,basePath, savedLocation) {
    fse.emptyDirSync(savedLocation)
    savedBase = path.basename(savedLocation)
    _.forEach(templateList,t=>{
        savedFilePath = _.replace(t.path,basePath,'')
        t.path = path.join(savedLocation,savedFilePath)
        fileBasePath = path.basename(path.dirname(t.path))
        currentBasePath = path.join(savedLocation,path.basename(path.dirname(t.path)))
        if (fileBasePath !== savedBase) fse.ensureDirSync(currentBasePath)
        fse.ensureFileSync(t.path)
        fse.writeJSONSync(t.path,t.json,{spaces: 4})
    })
}

Utils.prototype.copyRemaining = function copyRemaining(source,destination){
    fse.copySync(source,destination,{overwrite: false, })
}
Utils.prototype.replaceDelimetedText = function replaceDelimetedText(templateList) {
    return new Promise((resolve,reject)=>{
        try{
            loadEnvkeyValues()
            .then(()=>{
                mapDeep(templateList)
                resolve(templateList)
            })
        }
        catch(e){
            reject(e)
        }
    })

}
Utils.prototype.readJsonIntoObject = function parseJsonFiles(templateList){
    return new Promise((resolve,reject)=>{
        try{
            _.forIn(templateList,(v,k,o)=>{
                v.json = fse.readJSONSync(path.resolve(v.path))
            })
            resolve(templateList)
        }
        catch(e){
            reject(e)
        }
    })
}
Utils.prototype.createTemplateSkeleton = function createTemplateSkeleton(directoryTree){
    return new Promise((resolve,reject)=>{
        try{
            let data = directoryTree;
            let jsonChildren = _.chain(data.children)
                        .reduce(getJsonChildren, [])
                        .flatMapDeep()
                        .filter({ extension: '.json', type: 'file'})
            resolve(jsonChildren.value())
        }
        catch(e){
            reject(e)
        }
    })
}
Utils.prototype.parseDirectories = function parseDirectories(dirPath) {
    return new Promise((resolve,reject)=>{
        try{
            const config = dirTree(dirPath,{ extensions: /\.json/ })
            resolve(config)
        }
        catch(e){
            reject(e)
        }
    })
};

module.exports = Utils;