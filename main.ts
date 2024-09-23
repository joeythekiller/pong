// Function to move paddles
function movePaddle () {
    if (isPlayer1) {
        if (input.buttonIsPressed(Button.A) && paddle1 > 0) {
            // Move paddle 1 up
            paddle1 += -1
        }
        if (input.buttonIsPressed(Button.B) && paddle1 < 4) {
            // Move paddle 1 down
            paddle1 += 1
        }
        // Send paddle1 position to Player 2
        radio.sendValue("paddle1", paddle1)
    } else {
        if (input.buttonIsPressed(Button.A) && paddle2 > 0) {
            // Move paddle 2 up
            paddle2 += -1
        }
        if (input.buttonIsPressed(Button.B) && paddle2 < 4) {
            // Move paddle 2 down
            paddle2 += 1
        }
        // Send paddle2 position to Player 1
        radio.sendValue("paddle2", paddle2)
    }
}
// Function to move the ball
function moveBall () {
    if (isPlayer1) {
        ballX += ballDirX
        ballY += ballDirY
        // Bounce off top and bottom
        if (ballY <= 0 || ballY >= 4) {
            ballDirY = 0 - ballDirY
        }
        // Check paddle collision (left and right sides)
        if (ballX == 0 && ballY == paddle1) {
            // Bounce off Player 1's paddle
            ballDirX = 1
        } else if (ballX == 4 && ballY == paddle2) {
            // Bounce off Player 2's paddle
            ballDirX = -1
        }
        // Check if ball goes out of bounds (someone scores)
        if (ballX < 0 || ballX > 4) {
            // Reset ball position
            ballX = 2
            ballY = 2
            // Reverse direction
            ballDirX = 0 - ballDirX
            // Send reset signal
            radio.sendValue("reset", 1)
        }
        // Send ball position to Player 2
        radio.sendValue("ballX", ballX)
        radio.sendValue("ballY", ballY)
        radio.sendValue("ballDirX", ballDirX)
        radio.sendValue("ballDirY", ballDirY)
    }
}
// Function to display the paddles and ball
function drawGame () {
    basic.clearScreen()
    // Player 1 paddle (left)
    led.plot(0, paddle1)
    // Player 2 paddle (right)
    led.plot(4, paddle2)
    // Ball position
    led.plot(ballX, ballY)
}
// Radio receive event to update paddle and ball positions
radio.onReceivedValue(function (name, value) {
    if (name == "paddle1") {
        // Update Player 1 paddle position
        paddle1 = value
    } else if (name == "paddle2") {
        // Update Player 2 paddle position
        paddle2 = value
    } else if (name == "ballX") {
        // Update ball X position
        ballX = value
    } else if (name == "ballY") {
        // Update ball Y position
        ballY = value
    } else if (name == "ballDirX") {
        // Update ball X direction
        ballDirX = value
    } else if (name == "ballDirY") {
        // Update ball Y direction
        ballDirY = value
    } else if (name == "reset") {
        // Reset ball position after scoring
        ballX = 2
        ballY = 2
    }
})
let isPlayer1 = false
let ballDirY = 0
let ballDirX = 0
let ballY = 0
let ballX = 0
let paddle2 = 0
let paddle1 = 0
// Player 1 paddle position (left)
paddle1 = 2
// Player 2 paddle position (right)
paddle2 = 2
// Ball X position
ballX = 2
// Ball Y position
ballY = 2
// Ball X direction (1 or -1)
ballDirX = 1
// Ball Y direction (1 or -1)
ballDirY = 1
// Identify if this is Player 1 (True) or Player 2 (False)
isPlayer1 = true
// Set a radio group so both micro:bits can communicate
radio.setGroup(1)
// Initialize: check if this is Player 1 or Player 2
basic.showString("P1 or P2?")
if (input.buttonIsPressed(Button.A)) {
    // Player 1 controls left paddle
    isPlayer1 = true
    basic.showString("P1")
} else {
    // Player 2 controls right paddle
    isPlayer1 = false
    basic.showString("P2")
}
// Main game loop
basic.forever(function () {
    movePaddle()
    if (isPlayer1) {
        moveBall()
    }
    drawGame()
    // Game speed
    basic.pause(200)
})
