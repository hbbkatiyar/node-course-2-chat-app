var moment = require('moment');

// var date = moment();
// date.add(1, 'year').subtract(9, 'months');
// console.log(date.format('MMM Do, YYYY'));

var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = new Date().getTime();
var date = moment(createdAt);
console.log(date.format('h:mm a'));
