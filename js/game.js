class Game {
	constructor(othello)
	{
		this.othello = othello;
		this.reset();
	}

	reset()
	{
		this.othello.reset();
		currText.innerHTML = this.othello.chipState == this.othello.black ? 'Black' : 'White';

		this.drawBoards();
		this.drawChips();
	}

	clicked(e)
	{

		let x = e.x	- canvas.offsetLeft,
			y = e.y - canvas.offsetTop;

		this.update(x, y);
	}

	update(x, y)
	{
		x = Math.floor(x / (w / this.othello.size));
		y = Math.floor(y / (h / this.othello.size));

		if(this.othello.board[y][x] != this.othello.blank) return;

		if(this.othello.chipState == this.othello.black) this.othello.board[y][x] = this.othello.black;
		else if (this.othello.chipState == this.othello.white) this.othello.board[y][x] = this.othello.white;

		if(this.othello.check(this.othello.chipState, x, y)) {
			this.othello.chipState = this.othello.chipState == 2 ? 1 : 2;
			currText.innerHTML = this.othello.chipState == this.othello.black ? 'Black' : 'White';
			this.checkPlayState();
		} else {
			this.othello.board[y][x] = this.othello.blank;
		}
		this.drawChips();
	}

	drawBoards()
	{
		for(let i = 0; i < this.othello.size; i++) {
			for(let j = 0; j < this.othello.size; j++) {
				ctx.beginPath();
				ctx.rect(j * (w/this.othello.size), i * (h/this.othello.size), (w/this.othello.size), (h/this.othello.size));
				ctx.fillStyle = 'green';
				ctx.strokeStyle = 'saddlebrown';
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
			}
		}
	}

	drawChips()
	{
		for(let i = 0; i < this.othello.size; i++) {
			for(let j = 0; j < this.othello.size; j++) {
				if(this.othello.board[i][j] != this.othello.blank) {
					ctx.beginPath();
					ctx.arc(j * w/this.othello.size + w/this.othello.size / 2, 
						i * h /this.othello.size + h / this.othello.size /2, (w/this.othello.size- 0.2*w/this.othello.size)/2, 0, 2*Math.PI);
					if(this.othello.board[i][j] == this.othello.black) ctx.fillStyle = 'black';
					else if(this.othello.board[i][j] == this.othello.white) ctx.fillStyle = 'white';

					ctx.fill();

					ctx.closePath();
				}
			}
		}
	}

	checkPlayState()
	{
		let black = 0, white = 0;

		for(let i = 0; i < this.othello.size; i++) {
			for(let j = 0; j < this.othello.size; j++) {
				if(this.othello.board[i][j] == this.othello.black) black++;
				else if (this.othello.board[i][j] == this.othello.white) white++;
			}
		}

		if(black == 0 || white == 0 || black + white == this.othello.size * this.othello.size) {
			if(black > white) {
				alert("Black Win");
			} else {
				alert("White Win");
			}

			this.reset();
		}
	}
}