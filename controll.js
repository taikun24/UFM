let b_length = 10000;
let tick = 0;
let r_tick = 0;
const progress = document.getElementById('progress');
const p_display = document.getElementById('p_display');

progress.addEventListener("input", (event)=>{
	change_b_value(progress.value);
});
let isPlaying = false;
document.getElementById('play-pause').addEventListener("click", (event)=>{

	isPlaying = !isPlaying;
	if(isPlaying)setTimeout(c_loop, (1000/FRAMERATE));
	change_button();
});
function change_button(){
	if(isPlaying){
		document.getElementById('play-pause').children.item(0).src = "images/pause.svg"
		
	}else{
		document.getElementById('play-pause').children.item(0).src = "images/play.svg"
	}
}
function change_b_length(l){
	progress.max = l;
	b_length = l;
}
r_tim = 0;
function c_loop(){
	let now = new Date().getTime();
	let dil = now - r_tim;
	r_tim = now;
	if (dil < 0)dil = 0;
	change_b_value(parseInt(progress.value) + 1);
	if(tick >= b_length){change_b_value(b_length);isPlaying = false;change_button();}
	if(isPlaying)setTimeout(c_loop, 1000/FRAMERATE - dil);
}
change_b_length(100);
change_b_value(0);
function change_b_value(v){
	//move_to(v)
	let value= as_time(v);
	let max= as_time(b_length);
	p_display.innerHTML = value+"/"+max;
	tick = v;
	if(tick > b_length){tick = b_length;}
	progress.value = v;
}
function as_time(v){
	let s_second = v % FRAMERATE;
	let second = ((v - s_second)/FRAMERATE)%60;
	let mi = (v - second * FRAMERATE - s_second) / (FRAMERATE * 60);
	return mi.toString().padStart(2,"0")+':'+second.toString().padStart(2,"0")+':'+s_second.toString().padStart(2,"0");
}
let wheel = 0;
document.addEventListener('wheel', function(e) {
	//e.preventDefault();
	console.log(e)
  wheel += e.deltaY * 5;
},{ passive: false });