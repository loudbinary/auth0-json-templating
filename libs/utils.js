// My module
const path = require('path')
const fs = require('fs')
function Utils() {
    this.name = "utils"
}

Utils.prototype.parseDirectories = function parseDirectories(dirPath) {
    console.log("Enumerating:",dirPath)
    var config = require('require-dir-all') (dirPath, {recursive: true});
    return config;
};

module.exports = Utils;