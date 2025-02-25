const WIDTH = 568
const HEIGHT = 320
const use_fakeAudio = false

const fs = require('fs')
const { JSDOM } = require('jsdom')
const { CryptoJS } = require('./aes.js')
const {
  FakeAudio,
  FakeAudioGain,
  FakeAudioBufferNode,
  FakeAudioContext,
  FakeAudioPanner
} = require('./fakeAudio.js')
const {AudioContext} = require('node-web-audio-api')

globalThis.IG_GAME_SCALE = 1
globalThis.IG_GAME_CACHE = ''
globalThis.IG_ROOT = './assets/'
globalThis.IG_WIDTH = WIDTH
globalThis.IG_HEIGHT = HEIGHT
globalThis.IG_HIDE_DEBUG = false
globalThis.IG_SCREEN_MODE_OVERRIDE = 2
globalThis.IG_WEB_AUDIO_BGM = false
globalThis.IG_FORCE_HTML5_AUDIO = false
globalThis.LOAD_LEVEL_ON_GAME_START = null
globalThis.navigator.appVersion = 'N/A'
globalThis.name = ''

const canvas = document.getElementById('gameCanvas')
canvas.style = { width: String(WIDTH), height: String(HEIGHT) }
var original_document_getElementById = document.getElementById
document.getElementById = id => {
  if (id == 'canvas') {
    return canvas
  }
  return original_document_getElementById(id)
}

globalThis.$ = a => {
  return {
    width: a => {
      console.log('width', a)
      return WIDTH
    },
    height: a => {
      console.log('height', a)
      return HEIGHT
    },
    css: a => {}
  }
}

$.ajax = obj => {
  if (obj.url.match('NO_PATCH')) {
    obj.success.bind(obj.context)('')
    return
  }
  if (obj.url.match('php')) {
    obj.success.bind(obj.context)([])
    return
  }
  var xhr = new XMLHttpRequest()
  xhr.responseType = 'json'
  xhr.onload = () => {
    obj.success.bind(obj.context)(JSON.parse(String(xhr.response)))
  }
  xhr.onerror = () => {
    if (obj.url.match('php')) {
      obj.success.bind(obj.context)([])
    } else {
      obj.error.bind(obj.context)()
    }
  }
  xhr.open('GET', obj.url, true)
  xhr.send()
}

class HTMLElement {
  constructor () {
    this.child = []
  }
  $ (tag) {
    return [new Document()]
  }
  appendChild (a) {
    console.log('HTMLElement.appendChild', a)
    this.child.push(a)
  }
  addEventListener (id, f, g) {
    console.log('HTMLElement.addEventListener', id, f, g)
  }
}

class MyAudioContext extends AudioContext {
  decodeAudioData (arrayBuffer, successCallback, errorCallback) {
    try {
      if (arrayBuffer instanceof Buffer) {
        arrayBuffer = arrayBuffer.buffer
      }
      super.decodeAudioData.bind(this)(arrayBuffer, successCallback, () => {})
    } catch (e) {
      console.log(e)
    }
  }
  /*
  createPanner () {
    var r = undefined
    if (super.createPanner) {
      r = super.createPanner()
    }
    if (r == undefined) {
      return new FakeAudioPanner()
    }
    return r
  }
  createGain () {
    var r = super.createGain()
    if (!r) {
      return new FakeAudioGain()
    }
    const f = r.connect
    r.connect = a => {
      try {
        f.bind(r)(a)
      } catch (e) {
        //console.log(e)
      }
    }
    return r
  }
    */
}

class MyWorker extends globalThis.Worker {
  constructor(file) {
    super("file:///userdata/roms/jsgames/crosscode/public/" + file)
  }
}

const jsdom = new JSDOM()
globalThis.DOMParser = jsdom.window.DOMParser
globalThis.Math.seedrandomSeed = (seed)=>{}
globalThis.CryptoJS = CryptoJS
globalThis.HTMLElement = HTMLElement
globalThis.Worker = MyWorker
globalThis.AudioContext = MyAudioContext

if (use_fakeAudio) {
  globalThis.Audio = FakeAudio
  globalThis.AudioGain = FakeAudioGain
  globalThis.AudioBufferNode = FakeAudioBufferNode
  globalThis.AudioContext = FakeAudioContext
  globalThis.AudioPanner = FakeAudioPanner
}

require('./public/assets/js/game.compiled.js')

window.startCrossCode()
