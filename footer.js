
document.readyState = 'complete'
document.listener[0].f()

class Controller {
  constructor(instance){
    this.SDLinstance = instance
    this.instance = new ig.Gamepad()
    this.buttonPressed = []
    for(var i = 0; i < 20; i++) {
      this.buttonPressed.push(false)
    }
  }
  update(a){
    for (var i in this.buttonPressed) {
      a = this.instance.pressedStates[i] = this.buttonPressed[i]
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

const instances = new Set()

const openJoystick = (device) => {
  const instance = sdl.joystick.openDevice(device)
  instances.add(instance)
  ig.gamepad.handlers[0] = new Controller(instance)
  ig.gamepad.gamepads[0] = ig.gamepad.handlers[0].instance
  instance.on('*', (eventType, event) => {
    if (eventType === 'close') {
      instances.delete(instance)
    }
    if (eventType === 'buttonDown') {
      ig.gamepad.handlers[0].buttonPressed[event.button] = true
    }
    if (eventType === 'buttonUp') {
      ig.gamepad.handlers[0].buttonPressed[event.button] = false
    }
  })
}

var gamepadinit = false
var intervalID = setInterval(() => {
  if(!gamepadinit && ig.gamepad) {
    sdl.controller.on('deviceAdd', (event) => {
      openJoystick(event.device)
    })
    for (const device of sdl.joystick.devices) {
      openJoystick(device)
    }
    gamepadinit = true
  }
  const buffer = ig.system.canvas.data()
  gameWindow.render(ig.system.width, ig.system.height, ig.system.width * 4, 'rgba32', buffer)
}, 33);

console.log(
  window.IG_WIDTH,
  window.IG_HEIGHT,
  window.IG_GAME_SCALE)
window.startCrossCode()
