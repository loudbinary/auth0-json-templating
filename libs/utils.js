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
    console.log('Loading envkey values into process...')
    return new Promise((resolve,reject)=>{
        try{
            require('envkey')
            resolve(null)
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
            console.log("Enumerating all json files in directory:",dirPath)
            const config = dirTree(dirPath,{ extensions: /\.json/ })
            resolve(config)
        }
        catch(e){
            reject(e)
        }
    })
};

module.exports = Utils;