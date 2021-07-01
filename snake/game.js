/* CUSTOMIZATIONS */
//size of snake body (pixels): 1 - 125
const CELL_DIMENSION = 20
//space around each snake cell (pixels): 0 - half of CELL_DIMENSION
const FILL_OFFSET = 2
//frequency of board updates (seconds): .1 - 120
const FPS = 8
//frequency of extending tail (moves)
const GROWTH_FREQUENCY = 5
//gridlines: true || false
const SHOW_GRID = false
const SNAKE_COLOR = '#FE2712'
const GRID_LINES_COLOR = '#8c8da8'
const BOARD_COLOR = '#E3F7D4'


let adjusted_size = CELL_DIMENSION - FILL_OFFSET * 2

let canvas, ctx
let gameOver = false
let updates = 0
let height = window.innerHeight - 20
let width = window.innerWidth - 20
let rows = Math.floor(height / CELL_DIMENSION)
let columns = Math.floor(width / CELL_DIMENSION)

const direction = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
}

let snake = {
    length: 1,
    directon: direction.RIGHT,
    next: { x: 1, y: 0 },
    tail: [
        { x: 0, y: 0 }
    ]
}

window.onload = init

function init() {
    document.body.style.backgroundColor = BOARD_COLOR

    canvas = document.getElementById('board')
    ctx = canvas.getContext('2d')

    canvas.height = height
    canvas.width = width

    window.addEventListener('keydown', handleInput, false)
    document.getElementById('overlay').addEventListener('mouseup', restartGame, false)

    gameLoop(0)
}

function gameLoop(timestamp) {
    if (!gameOver) {
        draw()
        setTimeout(() => {
            updateSnake(timestamp)
            window.requestAnimationFrame(gameLoop)
        }, 1000 / FPS)
    }
    else
        gameOverHandler(timestamp)
}

function draw() {

    if (SHOW_GRID) {
        /* Draw gridlines */
        ctx.strokeStyle = GRID_LINES_COLOR
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < columns; c++)
                ctx.strokeRect(c * CELL_DIMENSION, r * CELL_DIMENSION, CELL_DIMENSION, CELL_DIMENSION)
    }

    ctx.fillStyle = BOARD_COLOR
    ctx.fillRect(0, 0, width, height)

    /* Draw snake */
    ctx.fillStyle = SNAKE_COLOR
    snake.tail.forEach(pos => {
        ctx.fillRect(pos.x * CELL_DIMENSION + FILL_OFFSET, pos.y * CELL_DIMENSION + FILL_OFFSET, adjusted_size, adjusted_size)
    })
}

function updateSnake(timestamp) {
    updates++

    if (updates % GROWTH_FREQUENCY == 0)
        snake.length++

    let impact = snake.tail.some(pos => pos.x === snake.next.x && pos.y === snake.next.y)
    if (impact)
        gameOver = true

    snake.tail.unshift({ x: snake.next.x, y: snake.next.y })

    if (snake.tail.length > snake.length)
        snake.tail.pop()

    //TODO: maybe add return within if
    switch (snake.directon) {
        case direction.LEFT:
            if (snake.next.x - 1 < 0)
                gameOver = true
            else
                snake.next.x--
            break
        case direction.UP:
            if (snake.next.y - 1 < 0)
                gameOver = true
            else
                snake.next.y--
            break
        case direction.RIGHT:
            if (snake.next.x + 1 > columns)
                gameOver = true
            else
                snake.next.x++
            break
        case direction.DOWN:
            if (snake.next.y + 1 > rows)
                gameOver = true
            else
                snake.next.y++
            break
    }
}

function handleInput(event) {
    console.log(event.key)

    switch (event.key) {
        case 'a':
        case 'ArrowLeft':
            snake.directon = snake.directon != (direction.LEFT + 2) % 4 ? direction.LEFT : snake.directon
            break
        case 'w':
        case 'ArrowUp':
            snake.directon = snake.directon != (direction.UP + 2) % 4 ? direction.UP : snake.directon
            break
        case 'd':
        case 'ArrowRight':
            snake.directon = (snake.directon != (direction.RIGHT + 2) % 4) ? direction.RIGHT : snake.directon
            break
        case 's':
        case 'ArrowDown':
            snake.directon = snake.directon != (direction.DOWN + 2) % 4 ? direction.DOWN : snake.directon
            break
    }
}

function gameOverHandler(timestamp) {
    document.getElementById('overlay').classList.add('gameOver')
    document.getElementById('finalScore').innerText =
        `Your final length was ${snake.length} cells
         and you lasted ${(timestamp / 1000).toFixed(1)} seconds`
}

function restartGame() {
    gameOver = false
    snake = {
        length: 1,
        directon: direction.RIGHT,
        next: { x: 1, y: 0 },
        tail: [
            { x: 0, y: 0 }
        ]
    }
    updates = 0
    document.getElementById('overlay').classList.remove('gameOver')

    gameLoop(0)
}