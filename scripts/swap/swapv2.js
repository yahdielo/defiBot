const { ethers} = require('ethers')
const { defi } = require('../vars')
const { save } = require('../save')
require('dotenv').config()
/** this module is to swap tokens from the uniswapv2 router02 */

/**get pool address  */
// getPair(address tokenA, address tokenB) function that returns the address of the pair contract
/** then calla  */
// function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)
// to get the reserves / liquidity of the tokens, from this i can get price , token0 / token1 = price

const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC);
const signer = new ethers.Wallet(process.env.WALLET0, provider);
const tokenAbi = require('../ABIs/erc20.json')

//contract router instance
const abi = require('../ABIs/uniswapV2Router02.json')
const router02Add = defi.uniswapV2Router02
const router = new ethers.Contract(router02Add, abi, signer)

//facotry intance
const factAbi = require('../ABIs/v2FactoryABI.json')
const factoryAdd = defi.uniswapv2Factory
const factory = new ethers.Contract(factoryAdd, factAbi, signer)

//weth address
let weth = '0x4200000000000000000000000000000000000006'

let poolAbi = require('../ABIs/uniswapv2Pair.json')


async function pairInfo(tokenAddress){
    //token contract intance to get token decimal
    let tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer)
    let decimals = await tokenContract.decimals();

    //confirm pair exisit
    // function getPair(address tokenA, address tokenB) external view returns (address pair);
    let pairAddress = await factory.getPair(weth,tokenAddress);

    //pool contract intance]
    let poolContract = new ethers.Contract(pairAddress, poolAbi, signer)
    let [wethLq, tokenLq] = await poolContract.getReserves() //element 0 is weth

    if(wethLq < 0.4){
        console.log('liquidity to low')
        return
    }

    //format big ints to get price
    let wethLQ = ethers.formatUnits(wethLq) 
    let tokenLQ = ethers.formatUnits(tokenLq, decimals) //dynamically add the decimals
   
    let price = wethLQ / tokenLQ
    //price:string, decimals: number, address: string
    return [wethLQ ,price.toFixed(18), pairAddress, decimals ]
}

async function buyTokenWithEthV2(tokenAddress){
  
   try {
    let [liquidity, price, pairAddress, decimals] = await pairInfo(tokenAddress)

    if(!liquidity){ //if lq to low dont buy
        return
    }

    /**MATH
     * get the amount to buy @ethAmount divide it by @price
     * get the amount of tokens you should get @amount
     * multiply the aproximate amoun of token you shoulf get  by 0.07 % to get approx slippage
     * then sub the tax to the amount you should get, this will cover a 2% slippage for pool fluctuations
     * @format: slice the amount out to after the decimal, and pass
     */
    let ethAmount = 0.007
    let amount = ethAmount.toFixed(18) /  price
    let tax = amount * 0.05
    let _amountOut = amount - tax
    let _amount = _amountOut.toString()
    let actualAmountOut = _amount.slice(0, _amount.indexOf('.'))
    
    console.log(actualAmountOut)

    let amountOutmin = ethers.parseUnits(actualAmountOut,0)//format the amounts
    
    let path = [weth,tokenAddress] //swapping path, from weth to token
    const deadline = Math.floor(Date.now() / 1000) + 60; // Deadline in 1 minutes

    /** 
    //weth contrtact instance
    //const wethAbi = require('../ABIs/WETHABI.json')
    //let WETH = new ethers.Contract(weth, wethAbi, signer);

    //approve router to spend Weth on my behalf
    //let approve = await WETH.approve(router02Add, ethers.parseUnits('10000', 18))
    //await approve.wait()
    //console.log('weth to router spending approve',approve.hash)
        */

    //initialize the swap
    /**/
    let tx = await router.swapExactETHForTokens(amountOutmin, //The minimum amount of output tokens that must be received for the transaction not to revert.
                                                path, 
                                                signer.address, //Recipient of the output tokens.
                                                deadline, //Unix timestamp after which the transaction will revert.
                    { value : ethers.parseEther(ethAmount.toString(), 'ether'), //vaue is hard coded to around $10
                    gasLimit: 300000}) //in the future i can make gas dinamyc

    //wait for transaction completion
    await tx.wait()

    console.log('compare to actual amount bougth',ethers.formatUnits(amountOutmin, 18))
    console.log('transaction completed\n',tx.hash)

    let priceAfter = await pairInfo(tokenAddress) //to get the price after execution 
    
    let obj = {
        'buyPrice' : priceAfter[0].toFixed(18),
        'lote' : '0.0016',
        'poolAddress' : pairAddress.toString(),
        'txHash' : tx.hash.toString(),
        'status' : 'open'
    }
    save(tokenAddress, obj)

   } catch(e){
        console.log('buy transaction error: something when wrong ')
   }
}
buyTokenWithEthV2('0x8ef8057a7df610a97cc9fbe02026807f8ee483e6')
module.exports = { buyTokenWithEthV2 }

