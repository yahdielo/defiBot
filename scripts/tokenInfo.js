const axios = require('axios')
const { ethers } = require('ethers')
const fs = require("fs");

require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC);
const signer = new ethers.Wallet(process.env.KINGDINO_PK, provider);

const abi = require('./ABIs/erc20.json')

//LOOK IN TO: for some reason the abi is save in the dir im calling the function
//@DEV currenlty this module is use to get the token abi to get symbol, total spply for the console.log
const tokenInfo = async (address) => { 

    const url = `https://api.basescan.org/api?module=contract&action=getabi&address=${address}&apikey=${process.env.BASESCAN_API_KEY}`;
    try{

        let res = await axios.get(url);
        if (res.data.result == 'Contract source code not verified'){
            return false
        }
        else {
            
            let contract = new ethers.Contract(address, abi , signer);
            let symbol = await contract.symbol();
            let totalSupply = await contract.totalSupply()

            return { 'ticker' : `${symbol}`, 'supply': totalSupply};
        }

    } catch(err){
        console.log('token info',err.code);
    }
}
//getAbi('0xf18958b476de2be17ab6da8d1337408f538b10aa');
module.exports = { tokenInfo }