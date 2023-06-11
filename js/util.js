const rectangularCollision = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.attackBox.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
};


// timer logic
let timer = 10;
let timerId = 10;

function determineEndGameStatus ({player, enemy, timerId}) {
  clearTimeout(timerId)
  document.querySelector("#displayGameResult").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#displayGameResult").innerHTML =
      "Mortal Kombat Declares A Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayGameResult").innerHTML =
      "Mortal Kombat Declares Player 1 Winner";
  } else if (player.health < enemy.health) {
    document.querySelector("#displayGameResult").innerHTML =
      "Mortal Kombat Declares Player 2 Winner";
  }
}

function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  } 
  
  if (timer === 0) {
    determineEndGameStatus({player, enemy, timerId})
  }
}