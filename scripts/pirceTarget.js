const { ethers} = require('ethers')
const { defi } = require('./vars')
const { getTokenBalance } = require('../scripts/tokenBalance')

require('dotenv').config()
/** this module is intendet to work as part 2 of the main
 * ones the tokens are snipe , this module will monitor prices for tokens in wallet
 * and ones price reach a target swap back the tokens for eth for profit 
 */

//weth address
let weth = '0x4200000000000000000000000000000000000006'

const provider = new ethers.JsonRpcProvider(process.env.BASE_SELLER_RPC);
const signer = new ethers.Wallet(process.env.WALLET0, provider);
const tokenAbi = require('./ABIs/erc20.json')

//factory intance
const factAbi = require('./ABIs/v2FactoryABI.json')
const factoryAdd = defi.uniswapv2Factory
const factory = new ethers.Contract(factoryAdd, factAbi, signer)

let poolAbi = require('./ABIs/uniswapv2Pair.json');


async function priceTarget(tokenAddress, buyPrice, loteSize){


    //token contract intance to get token decimal
    let tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer)
    let decimals = await tokenContract.decimals();

    //confirm pair exisit
    // function getPair(address tokenA, address tokenB) external view returns (address pair);
    let pairAddress = await factory.getPair(weth,tokenAddress);

    //pool contract intance]
    let poolContract = new ethers.Contract(pairAddress, poolAbi, signer)
    let [wethLq, tokenLq] = await poolContract.getReserves() //element 0 is weth

    //format big ints to get price
    let wethLQ = ethers.formatUnits(wethLq) 
    let tokenLQ = ethers.formatUnits(tokenLq, decimals) //dynamically add the decimals
   
    let price = wethLQ / tokenLQ

    let profitRange = buyPrice * 0.15 //profit range from 15 above

    
    if ( profitRange <= price){

        //get balance holdings
        let amount  = await getTokenBalance(tokenAddress)

        let sellAmount = ethers.formatUnits(amount, decimals) //format amount from hex to string
        console.log('selling: ', tokenAddress)

        let sellObj = {
            'tokenAddress':tokenAddress,
            'lote': loteSize,
            'amounToSell': sellAmount , 
            'decimals':decimals
        }
        return sellObj

    }else {
        return false
    }
    
}

module.exports = { priceTarget }