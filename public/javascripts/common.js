function dateFormat (data) {
	time = new Date(time);
  	const Mon=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
    let y = time.getFullYear();
    let m = time.getMonth();
    let d = time.getDate();
    // let H = time.getHours();
    // let M = time.getMinutes();
    // let S = time.getSeconds();

    let date = `${Mon[m]} ${d}, ${y}`;
    return date;
}

export {dateFormat}