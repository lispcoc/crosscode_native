
document.readyState = 'complete'
document.listener[0].f()

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
