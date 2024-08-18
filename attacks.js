let attacks = {
	"Blaster":{
		"name" : "Blaster",
		"icon" : "images/gb/spr_gasterblaster_0.png",
		"s_time" : 10,
		"time" : 100,
		"show" : true,
		"func" : (info, display, collisions)=>{
			//info x, y, vx, vy, time, size, vsize, rot vrot
			let x = info.x + info.vx * info.time / 20;
			let y = info.y + info.vy * info.time / 20;
			let size = info.size + info.vsize * info.time / 20;
			let rot = info.rot + info.vrot * info.time / 20;
			let sprite = info.time % 2 + 4;
			display.push({
				"type":"image",
			 	"image":"images/gb/spr_gasterblaster_"+sprite+".png",
				"x": x - 43,
				"y": y - 57,
				"size":size * 2,
				"rot":rot
			});
		},
		"supports" : {
			"bts" : function(info){
				return ["GasterBlaster",info.size, info.x, info.y, info.x, info.y, info.rot + 90, 0.5, 0.5];
			}
		}
	}
};
function a_init(){
	const foot = document.getElementsByTagName('footer').item(0);
	Object.values(attacks).forEach((at)=>{
		let element = '<div class="attack" draggable="true" name="'+at.name+'"><img src="'+at.icon+'" draggable="false"><p>'+at.name+'</p></div>';
		foot.innerHTML += element;
	});
}