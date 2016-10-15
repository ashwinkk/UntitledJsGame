var newclouds;
var obstacle = ["30%","10%","50%"],obstaclecomp = ["30%","50%","10%"];
var size=0;
var start_flag=0,reset_flag=0;
var score = 0;
var key_down = -1;
var key_presscheck,lastinterval;

autocall();
function autocall(){
	document.getElementById('bucky').style.left="45%";
	document.getElementById('bucky').style.bottom="50%";
	document.getElementById('bucky').style.display = "inline";
	document.getElementById('reset').addEventListener("click",reset);
	document.getElementById('start').addEventListener("click",start);
	document.getElementById("closegame").addEventListener("click",closegame);
	var classname = document.getElementById('gamestart').className;
	document.getElementById('gamestart').className =  "animatedpopup";
}
function start(){
	score = 0;
	document.getElementById('bucky').style.left="45%";
	document.getElementById('bucky').style.bottom="50%";
	document.getElementById('gamestart').className =  "fallback";
	newclouds = setInterval(function(){makecloud();},1200);
	document.body.onkeydown = function(keydownevent){key_down = keydownevent.which;};
	document.body.onkeyup = function(){key_down = -1;};
	document.getElementById('status').innerHTML=0+"";
	start_flag=1;
	reset_flag=0;
	key_presscheck = setInterval(function(){movechar(key_down);},25);
	lastinterval = key_presscheck;
}

function cloud(){
	this.leftobs = document.createElement("img");
	this.rightobs = document.createElement("img");
	var index = Math.floor(Math.random()*10);
	while(index>=3)
		index = Math.floor(Math.random()*10);
	this.leftobs.style.left = "0%";
	this.rightobs.style.right = "0%";
	this.leftobs.style.position = "absolute";
	this.rightobs.style.position = "absolute";
	this.leftobs.style.width = obstacle[index];
	this.rightobs.style.width = obstaclecomp[index];
	this.leftobs.style.height = "25px";
	this.rightobs.style.height = "25px";
	this.leftobs.src = "imgs/obs11.png";
	this.rightobs.src = "imgs/obs11.png";
	this.rightobs.style.bottom = "0%";
	this.leftobs.style.bottom = "0%";
	this.curry = this.leftobs.style.bottom;
	this.currx1 = this.leftobs.style.left;
	this.leftobs.style.transition = "bottom 0.1s";
	this.rightobs.style.transition = "bottom 0.1s";
	document.getElementById('gamearea').appendChild(this.leftobs);
	document.getElementById('gamearea').appendChild(this.rightobs);	
};

cloud.prototype.moveup = function(move,coll,c){
	var intcurr;
	intcurr = parseInt(this.curry);
	intcurr++;
	this.leftobs.style.bottom = intcurr+"%";
	this.rightobs.style.bottom = intcurr+"%";
	this.curry = intcurr+"%";
	if(intcurr>=100){
		clearInterval(coll);
		clearInterval(move);
		deletecloud(c);
	}
};

cloud.prototype.checkcollision = function(move){
	var bucky = document.getElementById('bucky'),i=0;
	var buckyy = parseInt(bucky.style.bottom),buckyx = parseInt(bucky.style.left);
	var buckyytop = (parseInt(bucky.offsetHeight)/document.getElementById("gamearea").offsetHeight*100)+buckyy;
	var curry = parseInt(this.curry),currx1 = parseInt(this.currx1);
	var perc1 = this.leftobs.offsetWidth/document.getElementById("gamearea").offsetWidth*100;
	var perc2 = this.rightobs.offsetWidth/document.getElementById("gamearea").offsetWidth*100;
	var perc3 = bucky.offsetWidth/document.getElementById("gamearea").offsetWidth*100;
	var currx2 = 100 - perc2;
	if(isHit(curry,currx1,currx2,buckyx,buckyy,buckyytop,perc1,perc2,perc3))
	{
		clearInterval(key_presscheck);
		document.getElementById('finalscore').innerHTML = "Your Score:" + score;
		document.getElementById('score').className = "animatedpopup";	
		clearInterval(move);
		for (i = 0; i <= lastinterval; i++)
     		window.clearInterval(i);
		clearInterval(newclouds);
	}
};


function makecloud(newclouds){
	var c = new cloud();
	size++;
	var coll = setInterval(function(){c.checkcollision(move)},50);
	var move = setInterval(function(){c.moveup(move,coll,c)},50);
	lastinterval = move;
}

function movechar(ev){
	var x = document.getElementById('bucky').style.left;
	var y = document.getElementById('bucky').style.top;
	var xn = parseInt(x);
	var yn = parseInt(y);
	var len = document.getElementById('bucky').offsetWidth/document.getElementById("gamearea").offsetWidth*100;
	if(ev!=-1){
		switch(ev){
			case 37:
				if(xn!=0)
					xn--;
				document.getElementById('bucky').style.left= xn+"%";
				break;
			case 39:
				if(xn+len<=100)
					xn++;
				document.getElementById('bucky').style.left= xn+"%";
				break;
		}
	}
}

function isHit(curry,currx1,currx2,buckyx,buckyy,buckyytop,perc1,perc2,perc3){
	if(curry>=buckyy&&curry<=buckyytop){
		if(((buckyx>=currx1&&buckyx<=(currx1+perc1))||((buckyx+perc3)>=currx1&&(buckyx+perc3)<=(currx1+perc1))))
			return 1;
		if(((buckyx>=currx2&&buckyx<=(currx2+perc2))||((buckyx+perc3)>=currx2&&(buckyx+perc3)<=(currx2+perc2))))
			return 1;
		if(reset_flag!=1&&curry==buckyy){
			score++;
			document.getElementById('status').innerHTML=score+" ";
		}
		return 0;
	}
	return 0;
}

function deletecloud(c){
	document.getElementById('gamearea').removeChild(c.leftobs);
	document.getElementById('gamearea').removeChild(c.rightobs);
}

function reset(){
	var x = document.getElementById('gamearea').childNodes;
	var size = x.length,pos=0;
	for(var i=0;i<size;i++){
		if(x[pos].tagName=="DIV"){
			pos++;
			i++;
		}
		document.getElementById('gamearea').removeChild(x[pos]);
	}
	size=0;
	document.getElementById('start').addEventListener("click",start);
	document.getElementById('status').innerHTML=0+"";
	reset_flag=1;
	document.getElementById('score').className = "fallback";
	start();
}

function closegame(){
	document.getElementById('game').className = "closegame";
	if(start_flag==0)
		document.getElementById('gamestart').className =  "fallback";
	else
		document.getElementById('score').className = "fallback";
	document.getElementById('bucky').style.display = "none";
	

	var x = document.getElementById('gamearea').childNodes;
	var size = x.length,pos=0;
	for(var i=0;i<size;i++){
		if(x[pos].tagName=="DIV"){
			pos++;
			i++;
		}
		document.getElementById('gamearea').removeChild(x[pos]);
	}
	size=0;
	document.getElementById('start').addEventListener("click",start);
	document.getElementById('status').innerHTML="";
	document.getElementById("closegame").style.display = "none";
}