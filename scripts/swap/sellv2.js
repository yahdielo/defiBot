const { ethers} = require('ethers')
const { defi } = require('../vars')
const { OP } = require('../rpcCall');
require('dotenv').config()
/** this module is to swap tokens from the uniswapv2 router02 */

/**get pool address  */
// getPair(address tokenA, address tokenB) function that returns the address of the pair contract
/** then calla  */
// function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)
// to get the reserves / liquidity of the tokens, from this i can get price , token0 / token1 = price

const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC);
const signer = new ethers.Wallet(process.env.WALLET0, provider);

//erc20 abi
const tokenAbi = require('../ABIs/erc20.json')

//contract router instance
const abi = require('../ABIs/uniswapV2Router02.json')
const router02Add = defi.uniswapV2Router02
const router = new ethers.Contract(router02Add, abi, signer)

//weth address
let weth = '0x4200000000000000000000000000000000000006'

async function sellToken(tradeObj){

    let tokenAddress = tradeObj['tokenAddress']
    let amounToSell = tradeObj['amounToSell']
    let decimals = tradeObj['decimals']
    let lote = tradeObj['lote']

    //let _amountin = ethers.formatUnits(amountin,  decimals) //decode the hex value
    let amountIn = ethers.parseUnits(amounToSell, decimals) //convert to big int

    //amount eth to get back now is hard coded, have to make it dynamic

    //@NOTE: dynaically change the amount min to recieve
    let amountOutMin = ethers.parseUnits(lote, 18)
    let path = [tokenAddress,weth]

    const deadline = Math.floor(Date.now() / 1000) + 60 * 2; // Deadline in 2 minutes

    //token contract intance
    let tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer)

    /*aprove router02 to spend tokens*/
    let approve = await tokenContract.approve(router02Add, amountIn)

    await approve.wait()
    console.log('spending approve',approve.hash)

    let tx = await router.swapExactTokensForETH(amountIn, //the amount of input tokens to send.
                                                amountOutMin, //The amount of ETH to receive.
                                                path, //pait trading path
                                                signer.address, //recipient of the trade output
                                                deadline, //deadline, amount of time pass before revert
                                                {gasLimit : 300000}
                                                )
    await tx.wait()
    console.log('SELL TX hash',tx.hash)
}
module.exports = { sellToken }