class Othello {
	constructor() {
		this.blank = 0;
		this.white = 1;
		this.black = 2;
		this.size = 8;
		this.chipState = this.white;
		this.mark = [];
		this.reset();
	}

	reset()
	{
		this.chipState = this.white;
		this.board = [
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,this.white,this.black,0,0,0],
			[0,0,0,this.black,this.white,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0]
		];
	}

	check(color, x, y)
	{
		let explored = false;
		for(let i = -1; i <= 1; i++) {
			for(let h = -1; h <= 1; h++) {
				if(
					(i == 0 && h == 0) //dia sendiri 
					|| x + h < 0 // koordinat x negatif
					|| x + h >= this.size // koordinat x over
					|| y + i < 0 // koordinat y negatif
					|| y + i >= this.size // koordinat y over
					|| this.board[y + i][x + h] == color //cek kalo dia
					|| this.board[y + i][x + h] == this.blank //cek kalo blank

				) {
					continue;
				}
				if(this.explore(color, x, y, i, h) !=false) {
					explored = true;
				}

			}
		}

		return explored;
	}

	findO(color,x,y,i,h) {
		while(true) {
			x +=h; //nyari ke sebelah
			y +=i; //nyari ke sebelah

			//klo sampe ujung g ketemu false
			if (x<0 || x>= this.size || y<0 || y>=this.size) {
				this.mark = [];
				return false;
			}

			//ketemu warna dasar di rubah
			if (this.board[y][x] == color) {
				for (let a=0; a<this.mark.length; a++) {
					this.board[this.mark[a].y][this.mark[a].x] = color;
				}
				this.mark = [];
				return true;
			}

			//nandain yang mau di rubah
			this.mark.push({x:x,y:y});

			//mencari lagi
			return this.findO(color,x,y,i,h);
		}
		return false;
	}

	explore(color, x, y, i, h)
	{
		let sx = x,
			sy = y;

		while(this.board[y][x] != this.blank) {
			x +=h; //nyari ke sebelah
			y +=i; //nyari ke sebelah

			if (x<0 || x>= this.size || y<0 || y>=this.size) break;

			if(this.board[y][x] == color) {
				while(true) {
					x -= h;
					y -= i;
					if(x == sx && y == sy) break;
					this.board[y][x] = color;
				}
				return true;
			}
		}

		return false;
	}
}