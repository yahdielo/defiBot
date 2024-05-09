const { OP } = require('./rpcCall')
const rpc = new OP(process.env.BASE_RPC)

const wallet = '0xb4d0bd19178EA860D5AefCdEfEab7fcFE9D8EF17';

async function getTokenBalance(tokenAddress){

    let tokenList = await rpc.getTokensList(wallet)

    for(let i = 0; i < tokenList.length; i++){
        if(tokenAddress == tokenList[i].contractAddress){
            return tokenList[i].tokenBalance //in hex, format with ethers
        }
    }

}

module.exports = { getTokenBalance }