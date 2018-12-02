const getTimestampToDate = (timestamp) => {

	console.log(timestamp.getFullYear);
	let chgTimestamp = timestamp.getFullYear().toString()

	+addZero(timestamp.getMonth()+1)

	+addZero(timestamp.getDate().toString())

	+addZero(timestamp.getHours().toString())

	+addZero(timestamp.getMinutes().toString())

	+addZero(timestamp.getSeconds().toString());

	return chgTimestamp;
}

const addZero = (data) => {
	return (data<10) ? "0"+data : data;
}

export {getTimestampToDate};