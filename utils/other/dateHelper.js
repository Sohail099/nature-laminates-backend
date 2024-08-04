module.exports.addDays=(date, days)=>{
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

module.exports.removeDays=(date, days)=>{
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

module.exports.removeDaysForAnalytics=(date, days)=>{
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    const day = result.getDate();
    const month = result.getMonth()+1;
    const year = result.getFullYear();
    const dateToCheck = `${day}-${month}-${year}`;
    return {
        day:weekday[result.getDay()],
        dateToCheck,
        month:monthNames[month-1],
        year
    }
}