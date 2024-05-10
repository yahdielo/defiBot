const { OP } = require('../scripts/rpcCall');

const ethers = require('ethers')
require('dotenv').config();




class BOT extends OP{

    constructor(endPoint){
        super(endPoint)
    }

    async ethBalance(){
        let r = await this.getEthBalance()
        return ethers.formatUnits(r)
    }

}

module.exports = { BOT }