const fs = require('fs')

const header = fs.readFileSync('header.js', { encoding: 'utf-8' })
const main = fs.readFileSync('assets/js/game.compiled.js', { encoding: 'utf-8' })
const footer = fs.readFileSync('footer.js', { encoding: 'utf-8' })

fs.writeFileSync('game.js', header + main + footer)
