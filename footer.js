
document.readyState = 'complete'
document.listener[0].f()

class Controller {
  constructor(instance){
    this.SDLinstance = instance
    this.instance = new ig.Gamepad()
    this.buttonPressed = []
    this.axesStates = []
    for(var i = 0; i < 20; i++) {
      this.buttonPressed.push(false)
      this.axesStates.push({})
    }
  }
  update(a){
    for (var i in this.buttonPressed) {
      a = this.instance.pressedStates[i] = this.buttonPressed[i]
    }
    for (var i in this.axesStates) {
      a = this.instance.axesStates[i] = this.axesStates[i]
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
  'leftStick': 10,
  'rightStick': 11,
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
  ig.gamepad.handlers[0] = new Controller(instance)
  ig.gamepad.gamepads[0] = ig.gamepad.handlers[0].instance
  instance.on('*', (eventType, event) => {
    if (eventType === 'close') {
      instances.delete(instance)
    }
    if (eventType === 'buttonDown') {
      ig.gamepad.handlers[0].buttonPressed[controllerMap[event.button]] = true
    }
    if (eventType === 'buttonUp') {
      ig.gamepad.handlers[0].buttonPressed[controllerMap[event.button]] = false
    }
    if (eventType === 'axisMotion') {
      ig.gamepad.handlers[0].axesStates[controllerMap[event.axis]] = event.value
    }
  })
}

var gamepadinit = false
var intervalID = setInterval(() => {
  if(!gamepadinit && ig.gamepad) {
    sdl.controller.on('deviceAdd', (event) => {
      openController(event.device)
    })
    for (const device of sdl.controller.devices) {
      openController(device)
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
