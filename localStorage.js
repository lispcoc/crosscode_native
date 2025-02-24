const fs = require('fs')

class LocalStorage {
    constructor(){
        this.data = {}
    }
    getItem(name){
        if(this.data[name]) {
            return this.data[name]
        }
        var file = null
        try {
            file = fs.readFileSync("save/" + name)
        } catch (e) {
            console.log("file not found", name)
            if( name == "cc.save"){
                file = '{ "name":"", "slots": [], "globals":{} }'
            } else if( name == "IG_LANG") {
                file = ""
            } else {
                file = null
            }
            return file
        }
        this.data[name] = file
        if( name == "cc.save" || "IG_LANG"){
            return JSON.parse(this.data[name])
        }
        return this.data[name]
    }
    setItem(name, a) {
        this.data[name] = JSON.stringify(a)
        fs.writeFileSync("save/" + name, this.data[name])
    }
}

var localStorage = new LocalStorage()

module.exports = { localStorage }