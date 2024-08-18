let overlay= document.getElementById('overlay');
function open_export(){	
	if(overlay.style.display == ''){
		overlay.style.display = 'none';
	}else{
		overlay.style.display = null;
	}
}
function export_bts(){
	objects.sort((a, b) =>{return a.time - b.time;});
	let prev = 0;
	let data = "0,CombatZoneResizeInstant,239,226,404,391\n0,HeartTeleport,320,304\n0,HeartMode,0";
	for(let i = 0;i < objects.length;i++){
		data += "\r\n";
		const atk = attacks[objects[i].name];
		let gap = (objects[i].time - prev)/FRAMERATE;
		prev = objects[i].time;
		const result = atk.supports.bts(objects[i].info);
		let line = gap;
		for (var j = 0; j < result.length; j++) {
			line += ",";
			line += result[j];
		}
		data += line;
	}
	const filename = "bad_time_simulator.csv";
	const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
	const blob = new Blob([bom, data], { type: "text/csv" });
	const link = document.getElementById("export_bts");
	link.download = filename
	link.href = URL.createObjectURL(new Blob([bom, data], { type: "text/csv" }));
	link.dataset.downloadurl = ["text/csv", link.download, link.href].join(":");
}
