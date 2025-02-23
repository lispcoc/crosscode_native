const fs = require('fs')

class LocalStorage {
    constructor(){
        this.data = {}
    }
    getItem(name){
        if(this.data[name]) {
            return this.data[name]
        }
        var file
        try {
            file = fs.readFileSync("save/" + name)
        } catch (e) {
            console.log("file not found", name)
            if( name = "cc.save"){
                return { "name":"", "slots": [], "globals":{} }
            }
        return {}
        }
        this.data[name] = file
        return JSON.parse(this.data[name])
    }
    setItem(name, a) {
        this.data[name] = JSON.stringify(a)
        fs.writeFileSync("save/" + name, this.data[name])
    }
}

instance = new LocalStorage()

module.exports = { instance }