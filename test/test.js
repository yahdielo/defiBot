const { OP } = require('../scripts/rpcCall')
const { ethers } = require('ethers')
require('dotenv').config()

const provider = process.env.BASE_RPC

let rpc = new OP(provider)


const test2 =  (tx) => {


}
async function test() {
    let tx = [0, 0 ,0]
    console.log(tx.length)
}
test()