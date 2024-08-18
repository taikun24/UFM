const FRAMERATE = 60;
const ZONE_WIDTH = 7;
let canvasParent, canvas;
let center_x = 0, center_y = 0;
let s_width = 640;
let s_height = 480;
let offX = 0;
let offY = 0;
let ctx;
let world = () => {
	canvas.width = canvasParent.clientWidth;
	center_x = canvas.width/2;
	canvas.height = canvasParent.clientHeight;
	center_y = canvas.height/2;
	d_draw();
	offX = (canvas.width - s_width)/2;
	if(offX < 0)offX = 0;
	offY = (canvas.height - s_height)/2;
	if(offY < 0)offY = 0;
};
function display_main(){
	d_init();
	setInterval(() => world(), 1000/FRAMERATE);
}
function d_init(){
	canvasParent = document.getElementById("canvas_p");
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
}
function d_draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw_zone(202, 195);
	d_tick();
}
function draw_zone(w, h){
	ctx.fillStyle = "white";
	ctx.fillRect(center_x - w/2 - ZONE_WIDTH, center_y - h / 2 - ZONE_WIDTH,ZONE_WIDTH, h + ZONE_WIDTH*2);
	ctx.fillRect(center_x - w/2 - ZONE_WIDTH, center_y - h / 2 - ZONE_WIDTH, w + ZONE_WIDTH*2,ZONE_WIDTH);
	ctx.fillRect(center_x - w/2 - ZONE_WIDTH, center_y + h / 2 + ZONE_WIDTH, w + ZONE_WIDTH*3,ZONE_WIDTH);
	ctx.fillRect(center_x + w/2 + ZONE_WIDTH, center_y +-h / 2 - ZONE_WIDTH,ZONE_WIDTH, w + ZONE_WIDTH*2);
}
let objects = [];
function append_object(obj_name, info, time){
	const def = attacks[obj_name];
	if(def == undefined)return;
	let new_atk = {
		"name" : obj_name,
		"time" : time,
		"info" : info
	};
	new_atk.show = def.show;
	for(let i = 0;i < objects.length; i++){
		if(objects[i].time < time){
			objects.splice(i, 0, new_atk);
			return;
		}
	}
	objects.push(new_atk);
}
let objects_temp = [];
let attack_show = [];
let image_temp = {};
let selected = {};
function draw_img(info){
	if(info.type == "image"){
		let img = image_temp[info.image];
		if(img == undefined){
			img = new Image();
			img.src = info.image;
			image_temp[info.image] = img;
		}
		ctx.save();
	    let x = offX + info.x;
	    let y = offY + info.y;
	    ctx.translate(x, y);
	    ctx.rotate(info.rot * Math.PI / 180);
	    if(info.size == 1){ctx.drawImage(img,0,0);}
	    else{ctx.drawImage(img,0,0,info.size * img.naturalWidth,info.size * img.naturalHeight);}
	    ctx.strokeStyle = 'white'; 
	    
	    ctx.strokeRect(0,0,info.size * img.naturalWidth,info.size * img.naturalHeight);
	    ctx.restore();
	}
}	
let preview_img = [];
function d_tick(){
	attack_show = objects.filter((element) => (attacks[element.name].time + element.time) > tick && tick >=  element.time);
	// //temp
	// let rmv = 0;
	// for (var i = 0; i < objects_temp.length; i++) {
	// 	if(objects_temp[i - rmv].time == tick){
	// 		attack_show.push(objects_temp[i - rmv]);
	// 		objects_temp.splice(i - rmv, 1);
	// 		rmv += 1;
	// 	}
	// }
	let display = [];
	let collisions = [];
	for(let i = 0;i < attack_show.length; i++){
		attack_show[i].info.time = tick - attack_show[i].time;
		attacks[attack_show[i].name].func(attack_show[i].info, display, collisions);
	}
	for (let i = 0;i < display.length; i++) {
		draw_img(display[i]);
	}
	for (let i = 0;i < preview_img.length; i++) {
		preview_img[0].x -= offX;
		preview_img[0].y -= offY;
		draw_img(preview_img[0]);
		preview_img.splice(0,1);
	}
}
// function move_to(t){
// 	objects_temp = [];
// 	let ok = false;
// 	for (var i = 0; i < objects.length; i++) {
// 		if(ok){
// 			objects_temp.push(objects[i]);
// 		}else{
// 			if(objects[i].time >= t){objects_temp.push(objects[i]);ok = true;}
// 		}
// 	}
// }
function onDrop(event){
	const data = event.dataTransfer.getData("application/ufm.atack");
	if(data == undefined){alert("Invalid attack object.");return;}
	console.log(event);
	//info x, y, vx, vy, time, size, vsize, rot vrot
	append_object(data, 
		{
			"x":event.offsetX - offX,
			"y":event.offsetY - offY,
			"vx":0,"vy":0,
			"time":0,"size":1,"vsize":0,"rot":wheel,"vrot":0
		}
	,tick);
}
const empty_image = new Image()
let type_temp;
empty_image.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAADUlEQVQI12M4ceLEfwAIDANY5PrZiQAAAABJRU5ErkJggg==";
function drop_init(){
	const atk_elements = document.getElementsByClassName('attack');
	for (let i = 0; i < atk_elements.length; i++) {
		const prevent = (e)=>e.preventDefault();
		atk_elements.item(i).addEventListener("dragstart", (event) =>{
			type_temp = event.target.getAttribute('name');
		  event.dataTransfer.setData("application/ufm.atack", event.target.getAttribute('name'))
		  event.dataTransfer.setDragImage(empty_image, 0, 0)
		}
		);
		canvas.addEventListener("dragover", (event)=>{
			prevent(event);
			if(type_temp != null){
				let display = [];
				const atk = attacks[type_temp];
				//info x, y, vx, vy, time, size, vsize, rot vrot
				preview_img = [];
				atk.func({
					"x":event.offsetX,"y":event.offsetY,
					"vx":0,"vy":0,
					"time":atk.s_time,
					"size":1,"vsize":0,
					"rot":wheel,"vrot":0
				},preview_img,[]);
			}
		});
		canvas.addEventListener("dragenter", prevent);
	}
	canvas.addEventListener("drop", onDrop);
}
function open_length(){
	const overlay= document.getElementById('ov_time');
	if(overlay.style.display == ''){
		overlay.style.display = 'none';
	}else{
		overlay.style.display = null;
	}
}