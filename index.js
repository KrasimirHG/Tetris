window.onload = function() {
	const grid = document.querySelector(".grid");

	const startButton = document.querySelector("#newGame");
	const y = parseInt(document.querySelector("#dim-y").value);
	const x = parseInt(document.querySelector("#dim-x").value);
	let currentPosition = Math.floor(x / 2 - 1);

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
	const result = document.querySelector("#result");
	let currentIndex = 0;
	const row = [];
	let score = 0;

	function createBoard() {
		const y = parseInt(document.querySelector("#dim-y").value);

		const x = parseInt(document.querySelector("#dim-x").value);

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
		else if (e.keyCode === 68) draw();
		else if (e.keyCode === 69) erase();
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

	//draw the tetramino
	function draw() {
		current.forEach((index) => {
			squares[currentPosition + index].classList.add("block");
			squares[currentPosition + index].style.backgroundImage =
				colors[color];
		});
	}

	//erase tetramino
	function erase() {
		current.forEach((index) => {
			squares[currentPosition + index].classList.remove("block");
			squares[currentPosition + index].style.backgroundImage = "none";
		});
	}

	function moveRight() {
		erase();
		function isRightEdge(index) {
			return (index + currentPosition) % x === x - 1;
		}

		const rightEdge = current.some(isRightEdge);

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
		console.log("currentPosition is", currentPosition);
		draw();
		freeze();
	}

	function freeze() {
		if (
			current.some(
				(index) =>
					squares[currentPosition + index + x].classList.contains(
						"block3"
					) ||
					squares[currentPosition + index + x].classList.contains(
						"block2"
					)
			)
		) {
			console.log("freeze");
			current.forEach((index) =>
				squares[currentPosition + index].classList.add("block2")
			);

			random = Math.floor(Math.random() * theTetrominoes.length);
			current = theTetrominoes[random][currentRotation];
			currentPosition = Math.floor(x / 2 - 1);
			draw();
			score();
			gameOver();
		}
	}

	//Game Over
	function gameOver() {
		if (
			current.some((index) =>
				squares[currentPosition + index].classList.contains("block2")
			)
		) {
			result.innerHTML = "Game Over";
			clearInterval(timer);
		}
	}

	function score() {
		for (currentIndex = 0; currentIndex < x * y; currentIndex += x) {
			for (let i = 0; i < x; i++) {
				row.push(currentIndex + i);
			}
			if (
				row.every((index) =>
					squares[index].classList.contains("block2")
				)
			) {
				score += 10;
				row.forEach((index) => {
					squares[index].style.backgroundImage = "none";
					squares[index].classList.remove("block2");
				});
			}
		}
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
