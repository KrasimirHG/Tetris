window.onload = function () {
	const grid = document.querySelector(".grid");

	const startButton = document.querySelector("#newGame");
	const y = parseInt(document.querySelector("#dim-y").value);
	const x = parseInt(document.querySelector("#dim-x").value);
	let currentPosition = Math.floor(x / 2 - 1);
	//console.log("current index is ", currentPosition);
	let currentRotation = 0;
	const colors = [
		"url(blue_block.png)",
		"url(purple_block.png)",
		"url(navy_block.png)",
		"url(pink_block.png)",
		"url(peach_block.png)",
		"url(yellow_block.png)",
	];
	let timer;
	let currentIndex = 0;

	function createBoard() {
		const y = parseInt(document.querySelector("#dim-y").value);
		//console.log("redovete sa: ", y);
		const x = parseInt(document.querySelector("#dim-x").value);
		//console.log("colonite sa: ", x);
		let wid = 20 * x;
		let hei = 20 * y;
		grid.style.width = wid;
		grid.style.height = hei;
		for (let i = 0; i < x * y; i++) {
			var block = document.createElement("div");
			block.classList.add("fon");
			grid.appendChild(block);
		}
		for (let i = 0; i < x; i++) {
			var block = document.createElement("div");
			block.classList.add("block3");
			grid.appendChild(block);
		}
	}

	createBoard();
	let squares = grid.querySelectorAll("div");

	function control(e) {
		console.log(e.keyCode);
		if (e.keyCode === 39) moveRight();
		else if (e.keyCode === 38 || e.keyCode === 82) rotate();
		else if (e.keyCode === 37) moveLeft();
		else if (e.keyCode === 40) moveDown();
	}

	// the classical behavior is to speed up the block if down button is kept pressed so doing that
	document.addEventListener("keydown", control);

	//The Tetrominoes
	const lTetromino = [
		[1, x + 1, x * 2 + 1, 2],
		[x, x + 1, x + 2, x * 2 + 2],
		[1, x + 1, x * 2 + 1, x * 2],
		[x, x * 2, x * 2 + 1, x * 2 + 2],
	];

	const zTetromino = [
		[0, x, x + 1, x * 2 + 1],
		[x + 1, x + 2, x * 2, x * 2 + 1],
		[0, x, x + 1, x * 2 + 1],
		[x + 1, x + 2, x * 2, x * 2 + 1],
	];

	const tTetromino = [
		[1, x, x + 1, x + 2],
		[1, x + 1, x + 2, x * 2 + 1],
		[x, x + 1, x + 2, x * 2 + 1],
		[1, x, x + 1, x * 2 + 1],
	];

	const oTetromino = [
		[0, 1, x, x + 1],
		[0, 1, x, x + 1],
		[0, 1, x, x + 1],
		[0, 1, x, x + 1],
	];

	const iTetromino = [
		[1, x + 1, x * 2 + 1, x * 3 + 1],
		[x, x + 1, x + 2, x + 3],
		[1, x + 1, x * 2 + 1, x * 3 + 1],
		[x, x + 1, x + 2, x + 3],
	];

	const theTetrominoes = [
		lTetromino,
		zTetromino,
		tTetromino,
		oTetromino,
		iTetromino,
	];

	//Select random tetramino
	let random = Math.floor(Math.random() * theTetrominoes.length);
	console.log("random is ", random);
	//Select current rotation
	let current = theTetrominoes[random][currentRotation];
	console.log("current is ", current);
	let color = Math.floor(Math.random() * colors.length);
	// console.log(color);

	//draw the tetramino
	function draw() {
		//console.log(current);

		// for (let i = 0; i < current.length; i++) {
		// 	squares[i + currentPosition].classList.add("block");
		// 	squares[i + currentPosition].style.backgroundImage = colors[color];
		// }
		current.forEach((index) => {
			squares[currentPosition + index].classList.add("block");
			squares[currentPosition + index].style.backgroundImage =
				colors[color];
		});
	}

	//erase tetramino
	function erase() {
		for (let i = 0; i < current.length; i++) {
			squares[i + currentPosition].classList.remove("block");
			squares[i + currentPosition].style.backgroundImage = "none";
		}
	}

	// draw();
	// setTimeout(erase, 2000);

	function moveRight() {
		erase();
		// function isRightEdge(index) {

		// 	return (index + currentPosition) % x === x - 1;
		// }

		// const rightEdge = current.some(isRightEdge);
		// console.log("rightEdge : ", rightEdge);
		let rightEdge = false;
		for (let i = 0; i < current.length; i++) {
			if ((i + currentPosition) % x === x - 1) rightEdge = true;
		}
		//console.log("rightEdge : ", rightEdge);
		if (!rightEdge) {
			currentPosition++;
		}
		if (
			current.some((index) =>
				squares[currentPosition + index].classList.contains("block2")
			)
		) {
			currentPosition -= 1;
		}
		draw();
	}

	function moveLeft() {
		erase();
		// const leftEdge = current.some((index) => {
		// 	(index + currentPosition) % x === 0;

		// });
		function isLeftEdge(index) {
			return (index + currentPosition) % x === 0;
		}
		const leftEdge = current.some(isLeftEdge);

		if (!leftEdge) {
			currentPosition--;
		}
		if (
			current.some((index) =>
				squares[currentPosition + index].classList.contains("block2")
			)
		) {
			currentPosition += 1;
		}
		draw();
	}

	function rotate() {
		erase();
		currentRotation++;
		if (currentRotation === current.length) {
			currentRotation = 0;
		}
		current = theTetrominoes[random][currentRotation];
		console.log(current);
		draw();
	}

	function moveDown() {
		erase();
		currentPosition += x;
		draw();
	}

	startButton.addEventListener("click", () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		} else {
			interval = setInterval(moveDown, 1000);
		}
	});
};
