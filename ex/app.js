var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var size = 8;
var width = canvas.width;
var height = canvas.height;

for(let i = 0; i < size; i++) {
	for(let j = 0; j < size; j++) {
		ctx.beginPath();
		ctx.rect(i * (width/size), j *(height/size), (width/size), (height/size));
		ctx.stroke();
		ctx.closePath();
	}
}

for(let i = 0; i < size; i++) {
	for(let j = 0; j < size; j++) {
		ctx.beginPath();
		ctx.arc((i * ((width/size)))+((width/size)/2), (j * ((height/size))) + ((height/size)/2), ((width/size)-20)/2, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();
	}
}