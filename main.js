var pos = 0;
var posBicycle = 0;
var widthDash = 22;
var dashPosition = 0;
var obstacles = [];
var score = 0;
var square = document.getElementById("bicycle");
var keypressed = false;
var keypressedTwo = false;
var distanceToLastObstacle = 50;

var bicycle = {
	el: document.getElementById("bicycle"),
	futurePosition: 0,
	position: 0
}

function getWidthOfRoad() {
	return document.getElementById("route").getBoundingClientRect().width;
}

function isColliding(el1, el2) {

    var rect1 = el1.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();
    return !(
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right
	);
}

function detectCollidion() {
	var bicycle = document.getElementById("bicycle");

	for (var i = obstacles.length -1 ; i >= 0 ; i-- ) {
		let obstacle= obstacles[i];

		let collideDetected = isColliding(bicycle, obstacle.el);

		if(collideDetected) {
			return obstacle;
		}
	}
	return undefined;
}

function createObstacle () {
	var obstacle = document.createElement("div");
	var type = 'bad';

	if(Math.random() > 0.7) { // 30% of good
		type = 'good';
		obstacle.classList.add('good-obstacle');
	}

	obstacle.classList.add('obstacle');
	obstacle.style.width = 50 + "px";
	obstacle.style.height = 50 + "px";
	var initialPosition = getWidthOfRoad();
	obstacle.style.left = initialPosition + 'px';
	obstacle.style.bottom = Math.random() * 65 + '%';
	var a = document.getElementById("route").appendChild(obstacle);

	obstacles.push({
		el: obstacle,
		left: initialPosition,
		type: type
	});
}

function moveObstacles() {
	for (var i = obstacles.length -1 ; i >= 0 ; i-- ) {
		let obstacle = obstacles[i];
		obstacle.left = obstacle.left - 1;
		obstacle.el.style.left = obstacle.left + 'px';
		if (score > 100) {
			obstacle.left = obstacle.left - 1;
		}
		if (score > 300) {
			obstacle.left = obstacle.left - 1;
		}
		if (score > 500) {
			obstacle.left = obstacle.left - 3;
		}
		if (obstacle.left < -50) {
			removeObstacle(obstacle);
		}
	}
}

function shouldCreateObstacle() {
	return Math.random() < 1/150;
}

function removeObstacle(obstacle) {
	obstacle.el.parentNode.removeChild(obstacle.el);
	obstacles.splice(obstacles.indexOf(obstacle), 1);
}

function goodCollisionDetected(intervalId, obstacle) {
	removeObstacle(obstacle);
	score = score + 30;
	var displayScore = document.getElementById("score").innerText = score;
}

function badCollisionDetected(intervalId, obstacle){
	clearInterval(intervalId);
	var button = document.getElementById("button");
	buttonStyle = button.style.display = "inline";
}

function myMove() {

	var elem = document.getElementById("dash");
	var trackP = document.getElementById("trackPosition");
	var dashP = document.getElementById("dashPosition");
	pos = 0;

	var id = setInterval(frame, 6);
	function frame() {
		var speed = 1;
		if (score > 100) {
			speed += 1;
		}
		if (score > 300) {
			speed += 1;
			square.style.transform = "rotate(-20deg)";
		}
		if (score > 500) {
			speed += 3;
			square.style.transform = "rotate(-30deg)";
		}

		if(distanceToLastObstacle > 50) {
			if(shouldCreateObstacle()) {
				createObstacle();
				distanceToLastObstacle = 0;
			}
		}
		else {
			distanceToLastObstacle = distanceToLastObstacle + speed;
		}


		pos -= speed;

		dashPosition = pos;
		obstaclePosition = pos;
		trackP.innerText = -pos;
		//dashPosition = dashPosition % (50*(-widthDash));
		//dashP.innerText = dashPosition;
		elem.style.backgroundPositionX = dashPosition + 'px';
		if(!keypressed) {
			moveBicycle(-.25);
		}
		if(keypressedTwo){
			moveBicycle(-.35);	
		}
		if(keypressed) {
			moveBicycle(.45);
		}
		
		moveObstacles();
		let obstacle = detectCollidion();

		if(obstacle && obstacle.type === "bad") {
			badCollisionDetected(id, obstacle);
		}

		if(obstacle && obstacle.type === "good") {
			goodCollisionDetected(id, obstacle);
		}

		square.style.bottom = posBicycle + '%';
	}
}

/*function keyUpFunction() {
	var square = document.getElementById("bicycle");

}*/



function moveBicycle(amount) {
	posBicycle = posBicycle + amount;
	posBicycle = Math.min(100, posBicycle);
	posBicycle = Math.max(0, posBicycle);
}


document.addEventListener('keydown', function(e) {
	if(e.keyCode === 38) {
		keypressed = true;
	}
	else if(e.keyCode === 40) {
		keypressedTwo = true;
	}
});

document.addEventListener('keyup', function(e) {
	keypressed = false;
	keypressedTwo = false;

});

function refreshPage() {
	window.location.reload();
}


