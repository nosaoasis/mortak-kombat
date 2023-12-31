const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d"); // canvas context

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background/background_layer_3_resize.png",
});

const shop = new Sprite({
  position: {
    x: 500,
    y: 10,
  },
  imageSrc: "./assets/decorations/shop_anim.png",
  scale: 4,
  framesMax: 6,
});

// create player 1 => player
const player = new Fighter({
  position: {
    x: 20,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  swordColor: "pink",
  imageSrc: "./assets/martial_hero/Idle.png",
  framesMax: 8,
  scale: 3,
  offset: {
    x: 215,
    y: 220,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/martial_hero/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/martial_hero/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/martial_hero/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/martial_hero/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/martial_hero/Attack1.png",
      framesMax: 6,
    },
    take_hit: {
      imageSrc: "./assets/martial_hero/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/martial_hero/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 180,
      y: 30,
    },
    width: 165,
    height: 50,
  },
});

// create player 2 => enemy
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "brown",
  offset: {
    x: -100,
    y: 0,
  },
  swordColor: "gray",
  imageSrc: "./assets/kenji/Idle.png",
  framesMax: 4,
  scale: 3,
  offset: {
    x: 215,
    y: 238,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/kenji/Attack1.png",
      framesMax: 4,
    },
    take_hit: {
      imageSrc: "./assets/kenji/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -160,
      y: 0,
    },
    width: 270,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.2)" 
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player moves
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // player is in the air/jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy moves
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // enemy is in the air/jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // detecting for player attack collisions
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takesHit();
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: enemy.health + "%"
    })
  }

  // if player missed
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking === false;
  }

  // detecting for enemy attack collisions
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
    player.takesHit();
    gsap.to("#playerHealth", {
      width: player.health + "%"
    })
  }

  // if enemy missed
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking === false;
  }

  // ending the game based on the health of a player
  if (enemy.health <= 0 || player.health <= 0) {
    determineEndGameStatus({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    switch (e.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (e.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  // enemy move keys
  switch (e.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
