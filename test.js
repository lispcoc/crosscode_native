const sdl = require('@kmamal/sdl')
const fs = require('fs')
const {Image, Canvas} = require('@napi-rs/canvas')
const {localStorage} = require('./localStorage.js')
const { JSDOM } = require('jsdom')
const jsdom = new JSDOM();

const WIDTH = 568
const HEIGHT = 320

class HTMLElement{
  constructor(){
    this.child = []
  }
  $(tag) {
    return [new Document()]
  }
  appendChild(a){
    console.log("HTMLElement.appendChild", a)
    this.child.push(a)
  }
  addEventListener(id, f, g){
    console.log("HTMLElement.addEventListener", id, f, g)
  }
}
class HTMLScript{
  constructor(){}
}
class XMLHttpRequest{
  constructor(){}
  open(type, file, flag) {}
  send() {
    if(this.onload){
      this.response = []//buffer
      this.onload()
    }
  }
}

var head = new HTMLElement()
class Document{
  constructor(){
    this.location = {
      href:""
    }
    this.readyState === null
    this.listener = []
    this.body = new HTMLElement()
  }
  addEventListener (a,b,c){
    console.log("Document.addEventListener", a,b,c)
    this.listener.push({n:a, f:b, c:c})
  }
  getElementsByTagName(a){
    console.log("Document.getElementsByTagName", a)
    if('head' == a) {
      return [head]
    }
    return [new HTMLElement()]
  }
  getElementById(a) {
    console.log("Document.getElementById", a)
    if (a == "canvas") {
      return canvas
    }
    if (a == "game") {
      return new HTMLElement()
    }
  }
  createElement (a) {
    if (a == "canvas") {
      return new Canvas(1024, 1024)
    }
    if (a == "script") {
      return new HTMLScript()
    }
  }
}
class fakeJquery{
  ajax(obj){
    fs.readFile("" + obj.url, (err, data) => {
      obj.success.bind(obj.context)(JSON.parse(String(data)))
    })
  }
}

class Audio{
  constructor(path){
    this.path = path
    this.duration = 1
    this.paused = false
    this.ended = false
  }
  pause(){
    this.paused = true
  }
  play(){
    this.paused = false
    return this
  }
  canPlayType(t){
    //console.log("canPlayType", t)
    return true
  }
  addEventListener(id, f, c) {
    if(id == "canplaythrough") {
      let r =new AudioContext()
      f(r)
    }
  }
  removeEventListener(id, f, c ){
  }
  load(){
    //console.log("load")
  }
}

class AudioGain{
  constructor(){
    //console.log("Audio")
    this.gain = {

    }
  }
  connect(a) {
  }
  disconnect(a){
  }
}
class AudioBufferNode{
  constructor(){
    this.playbackRate = {}
  }
  connect(gain){}
  noteOn(a, b){}
}
class AudioContext{
  constructor(){
    //console.log("Audio")
  }
  getCurrentTimeRaw() {
    return 0
  }
  createGain(a = null) {
    return new AudioGain()
  }
  decodeAudioData(buffer, f_ok, f_err){
    f_ok({buffer: buffer, duration: 2})
  }
  createBufferSource(){
    return new AudioBufferNode()
  }
  createPanner(){
    return new AudioPanner()
  }
}

class AudioPanner{
  setPosition(){}
  connect(a) {
  }
  disconnect(a){
  }
}

Math.seedrandomSeed = (seed)=>{}

globalThis.HTMLElement = HTMLElement
globalThis.DOMParser
globalThis.XMLHttpRequest = XMLHttpRequest
globalThis.Image = Image

var gameWindow = sdl.video.createWindow({ title: "Canvas", width: WIDTH, height: HEIGHT })
const canvas = new Canvas(WIDTH, HEIGHT)
globalThis.document = new Document()

globalThis.window = globalThis
var window = globalThis.window
window.screen = {
  availWidth: WIDTH,
}
console.log(screen)
globalThis.addEventListener =(a,b,c)=>{
  console.log("window.addEventListener",a,b,c)
}
globalThis.IG_ROOT = ""
canvas.width = WIDTH
canvas.height = HEIGHT
canvas.style = {width: String(WIDTH), height:String(HEIGHT)}
globalThis.navigator = {}
globalThis.navigator.userAgent = "Linux"
globalThis.navigator.appVersion = ""
globalThis.navigator.msMaxTouchPoints = ""
globalThis.navigator.getGamepads = () => {}
globalThis.IG_GAME_SCALE = 1;
globalThis.IG_GAME_CACHE = "";
globalThis.IG_ROOT = "assets/";
globalThis.IG_WIDTH = WIDTH;
globalThis.IG_HEIGHT = HEIGHT;
globalThis.IG_HIDE_DEBUG = false;
globalThis.IG_SCREEN_MODE_OVERRIDE = 2;
globalThis.IG_WEB_AUDIO_BGM = false;
globalThis.IG_FORCE_HTML5_AUDIO = false;
globalThis.LOAD_LEVEL_ON_GAME_START = null;
globalThis.Audio = Audio
globalThis.AudioContext = AudioContext
globalThis.DOMParser = jsdom.window.DOMParser
globalThis.name = ""
globalThis.localStorage = localStorage
globalThis.$ = (a) => {
  return {
    width: (a) => {
      console.log("width", a);
      return WIDTH
    },
    height: (a) => {
      console.log("height", a);
      return HEIGHT
    },
    css: (a) => {}
  }
}
$.ajax = (obj) => {
  fs.readFile("" + obj.url, (err, data) => {
    if(obj.url.match("php")){
      obj.success([])  
    } else if(!err || obj.url == "NO_PATCH"){
      obj.success.bind(obj.context)(JSON.parse(String(data)))  
    } else {
      obj.error()
    }
  })
}
globalThis.removeEventListener = (id, f, c ) => {
}


class Controller {
  constructor(instance){
    this.SDLinstance = instance
    this.buttons = []
    this.axes = []
    this.buttonDown = []
    this.buttonUp = []
    this.buttonStates = []
    this.axesStates = []
    for(var i = 0; i < 20; i++) {
      this.buttons.push(0)
      this.axes.push(0)
      this.buttonDown.push(false)
      this.buttonUp.push(false)
      this.buttonStates.push(0)
      this.axesStates.push({})
    }
  }
  update(a){
    console.log(JSON.stringify(a))
    a = a[0]
    for (var i in this.buttonDown) {
      if(this.buttonDown[i]) {
        a.updateButton(i, 1)
      }
      this.buttonDown[i] = false
    }
    for (var i in this.buttonUp) {
      if(this.buttonUp[i]) {
        a.updateButton(i, 0)
      }
      this.buttonUp[i] = false
    }
    for (var i in this.axesStates) {
      a.updateAxes(i, this.axesStates[i])
    }
  }
  /*
  buttonDeadzones: [],
  axesDeadzones: [],
  buttonStates: [],
  axesStates: [],
  pressedStates: [],
  releasedStates: [],
  */
}
const controllerMap = {
  'a': 0,
  'b': 1,
  'x': 2,
  'y': 3,
  'leftShoulder': 4,
  'rightShoulder': 5,
  'leftTrigger': 6,
  'rightTrigger': 7,
  'back': 8,
  'start': 9,
  'start': 9,
  'leftStick': 6,
  'rightStick': 7,
  'dpadUp': 12,
  'dpadDown' : 13,
  'dpadLeft': 14,
  'dpadRight' :15,
  'leftStickX': 0,
  'leftStickY': 1,
  'rightStickX': 2,
  'rightStickY': 3,
}

const instances = new Set()

const openController = (device) => {
  const instance = sdl.controller.openDevice(device)
  instances.add(instance)

  gamepad = new Controller(instance)
  //ig.gamepad.handlers[0] = new ControllerHandler(instance)
  //ig.gamepad.gamepads[0] = ig.gamepad.handlers[0].instance
  navigator.getGamepads = () => {
    return [gamepad]
  }
  instance.on('*', (eventType, event) => {
    const button = controllerMap[event.button]
    const axis = controllerMap[event.axis]
    if (eventType === 'close') {
      instances.delete(instance)
    }
    if (eventType === 'buttonDown') {
      gamepad.buttons[button] = 1
    }
    if (eventType === 'buttonUp') {
      gamepad.buttons[button] = 0
    }
    if (eventType === 'axisMotion') {
      gamepad.axes[axis] = event.value
    }
  })
}

var gamepadinit = false
var intervalID = setInterval(async () => {
  if(!gamepadinit && ig.gamepad) {
    sdl.controller.on('deviceAdd', (event) => {
      openController(event.device)
    })
    for (const device of sdl.controller.devices) {
      openController(device)
    }
    gamepadinit = true
  }

  gameWindow.render(ig.system.width, ig.system.height, ig.system.width * 4, 'rgba32', ig.system.canvas.data())
}, 16);


const { CryptoJS } = require("./assets/impact/page/js/aes.js")
globalThis.CryptoJS = CryptoJS
require("./assets/js/game.compiled.js")

document.readyState = 'complete'
document.listener[0].f()
window.startCrossCode()
