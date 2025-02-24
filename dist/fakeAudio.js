class FakeAudio {
  constructor (path) {
    this.path = path
    this.duration = 1
    this.paused = false
    this.ended = false
  }
  pause () {
    this.paused = true
  }
  play () {
    this.paused = false
    return this
  }
  canPlayType (t) {
    console.log("canPlayType", t)
    return true
  }
  addEventListener (id, f, c) {
    if (id == 'canplaythrough') {
      let r = new AudioContext()
      f(r)
    }
  }
  removeEventListener (id, f, c) {}
  load () {
    //console.log("load")
  }
}

class FakeAudioGain {
  constructor () {
    //console.log("Audio")
    this.gain = {}
  }
  connect (a) {}
  disconnect (a) {}
}

class FakeAudioBufferNode {
  constructor () {
    this.playbackRate = {}
  }
  connect (gain) {}
  noteOn (a, b) {}
}

class FakeAudioContext {
  constructor () {
    //console.log("Audio")
  }
  getCurrentTimeRaw () {
    return 0
  }
  createGain (a = null) {
    return new AudioGain()
  }
  decodeAudioData (buffer, f_ok, f_err) {
    f_ok({ buffer: buffer, duration: 2 })
  }
  createBufferSource () {
    return new AudioBufferNode()
  }
  createPanner () {
    return new AudioPanner()
  }
}

class FakeAudioPanner {
  setPosition () {}
  connect (a) {}
  disconnect (a) {}
}

export { FakeAudio, FakeAudioGain, FakeAudioBufferNode, FakeAudioContext, FakeAudioPanner }
