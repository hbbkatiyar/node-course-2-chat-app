var moment = require('moment');

var generateMessage = (from, text, color='#000000') => {
  return {
    from,
    text,
    color,
    createdAt: moment().valueOf()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

module.exports = { generateMessage, generateLocationMessage };
