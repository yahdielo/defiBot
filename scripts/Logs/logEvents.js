
const { defi }= require('../vars');
const { ethers } = require('ethers')
const { tokenInfo } = require('../tokenInfo');
require('dotenv').config();

const logEvents = async (txObj) => {
    //**CALLDATA** addLiquidity
    //** addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256) */
    //
    //**NOTE** 8bits == 8chars == 1byte 
    //@fix size arguments like addreses, uints ,bool are stored in 64chars spaces in the call data
    //@the function selector encoding is in the first 8 bit or byte1 of the calldata excluding 0x
    //@Addresses in ethereum are 40bits long wish you need to slice 24bits after selector
    //@ADDRESS Token1 - from character 34 + 40
    //@ADDRESS Token2 - from bit 98 to 138
    //slice the call data
    let select = txObj.input.slice(0,10);//first 8 bits excluding 0x
    let tokenA = txObj.input.slice(34, 74);
   
    if('addLiquidity' == defi.selectors['' + select]){
    
        let tokenB = txObj.input.slice(98, 138);
        let aAmount = BigInt('0x'+ txObj.input.slice(139, 202));
        let BAmount = BigInt( '0x'+txObj.input.slice(204, 204+62));

        console.log('\n===============================');
        console.log('====  ',defi['' + txObj.to], '  ====');
        console.log('====  ',defi.selectors['' + select], '       ====');
        console.log('=====================================================');
        console.log('TokenA:', '0x'+tokenA,'==');
        console.log('TokenB:', '0x'+tokenB,'==');
        console.log('=====================================================');
        console.log('AmountA:', ethers.formatUnits(aAmount), 'amountB:', ethers.formatUnits(BAmount));// need to work out where to put the coma
    }
    else if ('addLiquidityETH' == defi.selectors['' + select]){

        let address = '0x'+ tokenA;
        let info = await tokenInfo(address);

        let amountTokenIn = '0x'+txObj.input.slice(74, 74+64);
        amountTokenIn = ethers.formatUnits(amountTokenIn) * 1; //pare to int
        let ethAmount = txObj.value; //amount eth provided as liquidity
        ethAmount = ethers.formatUnits(ethAmount) * 1; //parsing to int
        
        if (info){
            let amountTokenIn = '0x'+txObj.input.slice(74, 74+64);
            amountTokenIn = ethers.formatUnits(amountTokenIn) * 1; //pare to int
            let ethAmount = txObj.value; //amount eth provided as liquidity
            ethAmount = ethers.formatUnits(ethAmount) * 1; //parsing to int

            console.log('\n===============================');
            console.log('====  ',defi['' + txObj.to], '  ====');
            console.log('====  ',defi.selectors['' + select], '    ====');
            console.log('=====================================================');
            //Price of TokenA = 1 WETH / 21,000,000 TokenA
            console.log(`${info.ticker}:`, '0x'+ tokenA,'==');
            console.log('=====================================================');
            console.log('Token in: ', amountTokenIn, '|', 'Amount Weth in: ', ethAmount);

            let price = ethAmount / amountTokenIn;
            console.log('initial token price: ', price.toFixed(18) );

        }
    }
}

module.exports = { logEvents }