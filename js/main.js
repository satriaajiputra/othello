
//
let game,
	profile,
	dataPlayer = [],
	gameSection = document.getElementById('game'),
	rulesSection = document.getElementById('rules'),
	menu = document.getElementById('menu'),
	ajax = new XMLHttpRequest();

game = new Game(new Othello());

if(document.cookie) {
	dataPlayer = JSON.parse(document.cookie);
}

if(typeof dataPlayer.data !== "undefined")  {
	rulesSection.style.display = "none";
	document.getElementById('profile').setAttribute('src', dataPlayer.data.photo);
	displayTime();
	game.isStarted = 1;
	ajax.open("GET", 'upload.php?mode=getcoordinate&id='+dataPlayer.data.id, false);
	ajax.send();
	if(ajax.readyState == XMLHttpRequest.DONE) {
		JSON.parse(ajax.responseText).data.forEach(function(r, i) {
			game.othello.board[r.x][r.y] = r.color;
		});
		draw();
	}

} else {
	gameSection.style.display = 'none';
	menu.style.display = 'none';
}

function draw() {
	ctx.save();
	ctx.restore();
	ctx.clearRect(0,0, w,h);

	game.drawBoards();
	game.drawChips();

	if(game.isStarted == 0 && dataPlayer.data.id !== undefined) {
		isGameStarted();
		game.isStarted = 1;
	}

	animationFrameId = requestAnimationFrame(draw);
}

function isGameStarted() {
	game.othello.saveCoordinate(3, 3, game.othello.white);
	game.othello.saveCoordinate(4, 4, game.othello.white);
	game.othello.saveCoordinate(4, 3, game.othello.black);
	game.othello.saveCoordinate(3, 4, game.othello.black);
}

function displayTime() {
	let startDate = new Date(dataPlayer.data.start_at);
	let converted = Math.floor((new Date().getTime()-startDate.getTime())/1000);

	document.getElementById('time').innerHTML = converted+"s";
}

canvas.addEventListener('click', function(e) {
	//check if player turn
	
	if (game.othello.chipState == game.othello.white) {
		game.clicked(e);
		setInterval(function() {
			runningAI();
		},2000);
	}

	displayTime();
});

function runningAI() {
	let batas= 0;
	//check if computer turn
	while (game.othello.chipState == game.othello.black) {
		//if no more step for stoping looping 
		if (batas>= 1000) {
			game.othello.chipState = game.othello.white;
			break;			
		}
		x = Math.floor((Math.random() * w));
		y = Math.floor((Math.random() * h));
		game.update(x, y);
		batas++;
	}
}

// Upload Gambar
let canvasPhoto = document.getElementById('image'),
	image = new Image(),
	formUpload = document.getElementById('photoUpload'),
	cv = canvasPhoto.getContext('2d');

formUpload.addEventListener('submit', function(ev) {
	ev.preventDefault();

	if(!!formUpload.photo.value) {
		image.src = URL.createObjectURL(formUpload.photo.files[0]);
		image.onload = function() {
			cv.clearRect(0,0, canvasPhoto.width, canvasPhoto.height);
			cv.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasPhoto.width, canvasPhoto.height);
			saveImage();
		}
		
	}
});

document.getElementById('reset').addEventListener('click', function(ev) {
	ajax.open("GET", "upload.php?mode=delete&id="+dataPlayer.data.id, false);
	ajax.send();

	if(ajax.readyState == XMLHttpRequest.DONE) {
		isGameStarted();
		window.location.reload();
	}
});

function saveImage() {
	let foto = canvasPhoto.toDataURL('image/png').replace('data:image/png;base64,', '');
	ajax.open('POST', 'upload.php?mode=upload', false);
	ajax.setRequestHeader('Content-Type', 'application/upload');
	ajax.send(foto);
	if(ajax.readyState == XMLHttpRequest.DONE) {
		dataPlayer = JSON.parse(ajax.responseText);
		document.cookie = name + '=' + JSON.stringify(dataPlayer);
		gameSection.style.display = 'block';
		rulesSection.style.display = 'none';
		menu.style.display = 'block';
		document.getElementById('profile').setAttribute('src', dataPlayer.data.photo);
		
		draw();
	}
}

// High Score
ajax.open("get", 'upload.php?mode=highscore', false);
ajax.send();
let highscore = document.getElementById('highscore');
if(ajax.readyState == XMLHttpRequest.DONE) {
	let data = JSON.parse(ajax.responseText).data;
	let html = '';
	if(typeof data !== "undefined") {
		html += '<table>'
					+'<tbody>';
		data.forEach(function(r, i) {
			html += '<tr>'
				+'<td><img src="'+r.photo+'" /></td>'
				+'<td>'+r.name+'</td>'
				+'<td>'+r.score+'</td>'
				+'<td>'+r.waktu+'s</td>'
			+'</tr>'
		});
		html +='</tbody>'
				+'</table>';
	}
	highscore.innerHTML = html;
}