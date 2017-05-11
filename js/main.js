
//
let game,
	profile,
	gameSection = document.getElementById('game'),
	rulesSection = document.getElementById('rules');

gameSection.style.display = 'none';

function draw() {
	ctx.save();
	ctx.restore();
	ctx.clearRect(0,0, w,h);

	game.drawBoards();
	game.drawChips();

	animationFrameId = requestAnimationFrame(draw);
}

canvas.addEventListener('click', function(e) {
	//check if player turn
	
	if (game.othello.chipState == game.othello.white) {
		game.clicked(e);
		setInterval(function() {
			runningAI();
		},2000);
	}	
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

// window.onload = function() {
// 	draw();
// }
// Upload Gambar
let canvasPhoto = document.getElementById('image'),
	image = new Image(),
	formUpload = document.getElementById('photoUpload'),
	cv = canvasPhoto.getContext('2d'),
	ajax = new XMLHttpRequest();

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

function saveImage() {
	let foto = canvasPhoto.toDataURL('image/png').replace('data:image/png;base64,', '');
	ajax.open('POST', 'upload.php', false);
	ajax.setRequestHeader('Content-Type', 'application/upload');
	ajax.send(foto);
	if(ajax.readyState == XMLHttpRequest.DONE) {
		profile = ajax.responseText.name;
		gameSection.style.display = 'block';
		rules.style.display = 'none';
		game = new Game(new Othello());
	}
}