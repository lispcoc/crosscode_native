class LocalStorage {
    constructor(){
        this.data = {}
    }
    getItem(name){
        console.log("LocalStorage.getItem", name)
        if(this.data[name]) {
            return this.data[name]
        }
        if( name = "cc.save"){
            return '{ "name":"", "slots": [], "globals":{} }'
        }
        return "{}"
    }
    setItem(name, a) {
        console.log("LocalStorage.setItem", name)
        this.data[name] = JSON.stringify(a)
    }
}

instance = new LocalStorage()

module.exports = { instance }