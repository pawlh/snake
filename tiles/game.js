let canvas
let ctx

let height = window.innerHeight
let width = window.innerWidth

let CELL_DIMENSION = 200

let rows = Math.floor(height / CELL_DIMENSION)
let columns = Math.floor(width / CELL_DIMENSION)

window.onload = init

function init() {
    canvas = document.getElementById('board')
    ctx = canvas.getContext('2d')

    canvas.height = height
    canvas.width = width

    window.requestAnimationFrame(gameLoop)
}

function gameLoop() {
    draw();
    window.requestAnimationFrame(gameLoop)
}

function draw() {

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            ctx.fillStyle = Math.random() > 0.5 ? 'blue' : 'black'
            ctx.fillRect(c * CELL_DIMENSION, r * CELL_DIMENSION, CELL_DIMENSION, CELL_DIMENSION)
        }
    }
}