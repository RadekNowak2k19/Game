import "./style.css";

const appElement = <HTMLDivElement>document.querySelector("#app");

// Board element
const board = document.createElement("div");
board.classList.add("board");
appElement.appendChild(board);
// Player element
const player = document.createElement("div");
player.classList.add("player");
board.appendChild(player);

// Selectors
const playerElement = <HTMLDivElement>document.querySelector(".player");
const boardElement = <HTMLDivElement>document.querySelector(".board");

// Arrays
let bullets: HTMLDivElement[] = [];
let enemies: HTMLDivElement[] = [];

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// Game initialization
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const startGameElement = <HTMLDivElement>document.createElement("div");
startGameElement.classList.add("popup");
const headingElement = <HTMLHeadingElement>document.createElement("h1");
headingElement.classList.add("heading");
const paragraphElement = <HTMLParagraphElement>document.createElement("p");
paragraphElement.classList.add("text");
const buttonElement = <HTMLButtonElement>document.createElement("button");
buttonElement.classList.add("btn");

headingElement.innerText = `Welcome`;
paragraphElement.innerText = `Please, click button to start the game`;
buttonElement.innerText = "Start";

appElement.appendChild(startGameElement);
startGameElement.appendChild(headingElement);
startGameElement.appendChild(paragraphElement);
startGameElement.appendChild(buttonElement);

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// Check bullet || enemy position
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const checkCollision = (bullet: DOMRect, enemy: DOMRect) => {
	return (
		bullet.left > enemy.left &&
		bullet.right < enemy.right &&
		bullet.top < enemy.bottom
	);
};
const checkBullet_EnemyPosition = (bullet: HTMLDivElement) => {
	const bulletPosition = bullet.getBoundingClientRect();
	for (let i = 0; i < enemies.length; i++) {
		const enemy: HTMLDivElement = enemies[i];
		const enemyPosition = enemies[i].getBoundingClientRect();

		if (checkCollision(bulletPosition, enemyPosition)) {
			const index = bullets.indexOf(bullet);
			bullets.splice(index, 1);
			bullet.remove();

			enemies.splice(i, 1);
			enemy.remove();
			break;
		}
	}
};

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// Create element
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const createBullet = () => {
	const bullet = <HTMLDivElement>document.createElement("div");
	bullet.classList.add("bullet");
	bullet.style.left = `${playerElement.offsetLeft}px`;
	boardElement.appendChild(bullet);
	bullets.push(bullet);
};
const createEnemy = () => {
	const randomPosition = boardElement.getBoundingClientRect().width;

	const enemy = <HTMLDivElement>document.createElement("div");
	enemy.classList.add("enemy");
	enemy.style.left = `${Math.floor(Math.random() * randomPosition)}px`;

	const shouldCreateEnemy = Math.floor(Math.random() * 2);
	if (shouldCreateEnemy) {
		boardElement.appendChild(enemy);
		enemies.push(enemy);
	}
};
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// Move element
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const move = (position: number) => {
	const playerPosition = playerElement.offsetLeft;
	const newPosition = playerPosition + position * 10;
	const { left, right } = boardElement.getBoundingClientRect();
	const maxRight =
		right - left - playerElement.getBoundingClientRect().width / 2;

	if (newPosition >= 0 && newPosition <= maxRight) {
		playerElement.style.left = `${newPosition}px`;
	}
};
const moveBullet = () => {
	for (let i = 0; i < bullets.length; i++) {
		const bullet = <HTMLDivElement>bullets[i];
		bullet.style.top = `${bullet.offsetTop - 5}px`;

		// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
		// Check if bullet position > boardElement.Top
		// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
		if (bullet.offsetTop < -20) {
			bullets.shift();
			bullet.remove();
		} else checkBullet_EnemyPosition(bullet);
	}
};
const moveEnemy = () => {
	for (let i = 0; i < enemies.length; i++) {
		const enemy = <HTMLDivElement>enemies[i];
		enemy.style.top = `${enemy.offsetTop + 5}px`;
		// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
		// Check enemy position || bullet hit enemy || enemy leaves board
		// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
		if (enemy.offsetTop > boardElement.getBoundingClientRect().height - 40) {
			gameOver();
		}
	}
};

const handleMovePlayer = (e: KeyboardEvent) => {
	switch (e.code) {
		case "ArrowLeft":
			move(-1);
			break;
		case "ArrowRight":
			move(1);
			break;
		case "Space":
			createBullet();
			break;
	}
};
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// Game setting
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
let moveBulletInterval: number;
let moveEnemyInterval: number;
let createEnemyInterval: number;
const startGame = () => {
	window.addEventListener("keydown", handleMovePlayer);
	moveBulletInterval = setInterval(moveBullet, 50);
	createEnemyInterval = setInterval(createEnemy, 2000);
	moveEnemyInterval = setInterval(moveEnemy, 50);
	startGameElement.remove();
};
const startAgain = () => window.location.reload();
const gameOver = () => {
	window.removeEventListener("keydown", handleMovePlayer);
	clearInterval(moveBulletInterval);
	clearInterval(moveEnemyInterval);
	clearInterval(createEnemyInterval);
	appElement.appendChild(startGameElement);
	buttonElement.innerText = "Restart Game";
	headingElement.innerText = "Game Over :(";
	buttonElement.addEventListener("click", startAgain);
};
buttonElement.addEventListener("click", startGame);
