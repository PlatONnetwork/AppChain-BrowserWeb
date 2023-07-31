import Vue from "vue";
import BigNumber from "bignumber.js";

const formatDecimal = function(num, decimal) {
  num = num.toString()
  var index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
}

const fromWei = function(num, decimal) {
  return new BigNumber(num).div(new BigNumber(10).pow(new BigNumber(decimal))).toFixed()
}


export { formatDecimal, fromWei }
