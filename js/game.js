$(() => {
  // Set up some constants
  const RENDER_SCALE = 3
  const SHOOT_KEY = 32
  const LEFT_KEY = 37
  const RIGHT_KEY = 39
  const INVADER_ROWS = [
    './img/invader-1.gif',
    './img/invader-1.gif',
    './img/invader-2.gif',
    './img/invader-3.gif',
    './img/invader-3.gif'
  ]

  // Get the <div> we'll be putting all of our elements into
  const game = $('#game').css({
    width: 217 * RENDER_SCALE,
    height: 248 * RENDER_SCALE
  })

  // Repositions an image to reflect the game object's current position
  const repositionImage = img => {
    img.css({
      'left': img.data('x') * RENDER_SCALE,
      'top': img.data('y') * RENDER_SCALE
    })
  }

  // Create the background
  $('<img>')
    .attr({
      src: './img/background.png',
      width: 217 * RENDER_SCALE,
      height: 248 * RENDER_SCALE
    })
    .appendTo(game)

  // Create a ship
  const ship = $('<img>')
    .data({
      x: 100,
      y: 208
    })
    .attr({
      src: './img/ship.png',
      width: 13 * RENDER_SCALE,
      height: 8 * RENDER_SCALE
    })
    .appendTo(game)

  // Create an array for our lasers
  const lasers = []

  // Create the invaders
  const invaders = []
  for (let row = 0; row < INVADER_ROWS.length; row++) {
    const src = INVADER_ROWS[row]
    for (let col = 0; col < 11; col++) {
      invaders.push($('<img>')
        .data({
          x: 20 + 16 * col,
          y: 54 + 16 * row
        })
        .attr({
          src: src,
          width: 16 * RENDER_SCALE,
          height: 8 * RENDER_SCALE
        })
        .appendTo(game))
    }
  }

  // Keep track of keypresses
  const keys = {}
  $('body').on('keyup keydown', evt => {
    keys[evt.which] = (evt.type === 'keydown')

    // Also shoot lasers on keypress
    if (evt.type === 'keydown' && evt.which === SHOOT_KEY) {
      lasers.push($('<img>')
        .data({
          x: ship.data('x') + 6,
          y: ship.data('y')
        })
        .attr({
          src: './img/laser.png',
          width: 1 * RENDER_SCALE,
          height: 4 * RENDER_SCALE
        })
        .appendTo(game))
    }
  })

  // Update the state of the game 30-60 times per second
  const loop = () => {
    // Update the ships position based on keypresses
    ship.data('x', ship.data('x') + (keys[LEFT_KEY] ? -1 : 0) + (keys[RIGHT_KEY] ? 1 : 0))

    // Redraw the ship at its new location
    repositionImage(ship)

    // Move the lasers
    for (const laser of lasers) {
      laser.data('y', laser.data('y') - 2)
      repositionImage(laser)
    }
    
    // Update the invaders
    for (const invader of invaders) {
      const invaderX = invader.data('x'), invaderY = invader.data('y')
      // Check to see if any lasers are hitting the invader
      for (const laser of lasers) {
        const laserX = laser.data('x'), laserY = laser.data('y')
        if (invaderX < laserX && laserX < invaderX + 16 && invaderY < laserY && laserY < invaderY + 8) {
          // If so, simulate their destruction by just removing them off-screen ;)
          invader.data('x', -1000)
          laser.data('x', 1000)
          break
        }
      }
      repositionImage(invader)
    }

    // Schedule the next update
    window.requestAnimationFrame(loop)
  }

  // Kick off the game loop
  window.requestAnimationFrame(loop)
})
