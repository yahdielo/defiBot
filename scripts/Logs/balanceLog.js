const { tokenInfo } = require("../tokenInfo");
const { ethers } = require('ethers');

//@TODO: call the get ABI and print the token symbol not the address
async function logBalance (obj) {

    console.log('=====================================================');
    console.log(obj.contractAddress);
    console.log(parseInt(obj.tokenBalance));
  }

  module.exports = { logBalance } 