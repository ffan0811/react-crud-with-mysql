const getTimestampToDate = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let chgTimestamp = date.getFullYear().toString() + '/'
        + addZero(date.getMonth() + 1) + '/' +
        + addZero(date.getDate().toString()) + ' '
        + addZero(date.getHours().toString()) + ':'
        + addZero(date.getMinutes().toString()) + ':'
        + addZero(date.getSeconds().toString());
    return chgTimestamp;
}

const addZero = (data) => {
    return (data < 10) ? "0"+data : data;
}

export {getTimestampToDate};