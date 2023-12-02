const R = require('ramda');

module.exports = {
  R
};

const f = R.pipe(
    console.log
)

f('hello ramda');