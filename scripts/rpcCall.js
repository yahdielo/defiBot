const axios = require("axios");
const { defi } = require('./vars');


class OP {

    //Body of rpc request with axios
    methodNames = [];
    rpcMethod = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": `${this.methodNames}`,
        headers: {
          "Content-Type": "application/json",
      }
    }

    constructor(endPoint){// rpovider endpoint 

        this.endPoint = endPoint;//example: https://base-mainnet.g.alchemy.com/v2/{apikey}
    }

    async call(_method){
        
            this.rpcMethod.method = _method;
            if(_method[1]){
                this.rpcMethod.method = _method[0];
                this.rpcMethod.params = _method[1];
            }
            else{
                this.rpcMethod.method =_method[0];
            }
                let response = await axios.post(this.endPoint, this.rpcMethod);
                return response

    }

    async getBlockNumber(){  
        //get the most recent block Number in hex
        let r = await this.call(["eth_blockNumber"]);
        return r.data.result;
    }

    async getBlockByNumber(number){  
        //get the most recent block Number in hex
        let r = await this.call(["eth_getBlockByNumber", [number, true]]);
        return r.data.result; //retuns the block
    }
    async getEthBalance(){
        let wallet = '0xb4d0bd19178EA860D5AefCdEfEab7fcFE9D8EF17'
        let r = await this.call(["eth_getBalance", [wallet, 'latest']]);
        return r.data.result

    }
    async getBlockByHash(blockHash){  
        //get the most recent block Number in hex
        let r = await this.call(["eth_getBlockByHash", [blockHash, true]]);
        return r.data.result; //retuns the block
    }

    async getBlockTxs(){ //this will return the recent block transactions
        //by calling this method striagh you get the transaction of the most recnt block
        let number = await this.getBlockNumber();
        let block = await this.getBlockByNumber(number);

        return block.transactions;//list of transactions of the most rescent block
    }

   
    async getTxByHash(txHash){// returns a transaction by passing the hash as agument
        let r = await this.call(["eth_getTransactionByHash", [txHash]]);
        return r.data.result; //returns transaction object
    }
    
    async getTokensList(walletAddress){// get all ERC own by wallet
        let r = await this.call(["alchemy_getTokenBalances", [walletAddress]]);

        /** */
        let tokens = r.data.result.tokenBalances;
        let list = [];

        for(let i = 0; i < tokens.length; i++){
            if(parseInt(tokens[i].tokenBalance) != 0){ //filter balances with 0
                list.push(tokens[i])
            }
        }
        return list; //returns list of tokens
    }

    async  getTokenBalance(tokenList, tokenAddress){
        /**
         * This module will return the balance of the token
         * for the sell swap
         */
        for(let i = 0; i < tokenList.length; i++){
    
            if(tokenAddress == tokenList[i].contractAddress){
               
                //return the amount of the token needs to be formated on the caller function
                return tokenList[i].tokenBalance
            }
        }
        console.log('not found')
        return
    }

    async getWalletTxHistory(address){
        /** get all ERC20 and ETH external tranfer of a wallet and  */

        let r = await this.call(["alchemy_getAssetTransfers", 
                                [{'fromBlock': '0x0', 'toAddress': address, 
                                category: ["external", "erc20"]}]]);
        return r.data.result.transfers //returns a list of all the txsObjects
    }

    toHex(number){//convert in to hex

        return number.toString(16);
    }
}

module.exports = { OP }