// Given a CSS id, removes the element from the DOM

const d3 = require('d3');

module.exports = elementID => {
  d3.select(`#${elementID}`).remove();
};
