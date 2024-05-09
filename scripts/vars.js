
const defi = {
    '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad' : 'universalRouter',//main contract for v2swaps
    '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24' : 'uniswapV2Router002',//swapexactEthForTokensSopportinFeesOnToken
    '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24' : 'uniswapV2Router02',//swapexactEthForTokens
    '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6' : 'uniswapV2Factory', // handles creations of pools uniV2

    uniswapv2Factory : '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    uniswapV2Router02 : '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',

    selectors : {
        '0xe8e33700' : 'addLiquidity',// erc20 /erc20
        '0xf305d719' : 'addLiquidityETH', //eth to WETH / token
        '0x02751cec' : 'removeLiquidityETH',
        '0x3593564c': 'Execute',
        '0x7ff36ab5': 'swapExactETHForTokens',
        '0x18cbafe5' : 'swapExactTokensForETH',
        swapExactETHForTokens : '0x7ff36ab5',
        swapExactTokensForETH : '0x18cbafe5',
    },
    tokens : { //currently have this tokens
        '0x4C674b318b27c4061Fc94660922f504a4db6AE79' : 'OZPC',
        '0x91337a62FaE969e2BcaDeb5B86E6874EbC117286' : 'wif (dogwithbluehat)',
        '0x0f884a04d15a3cf4aecda7de0288c3a611326839' : 'CJ',
        '0x58c385854294F0347242Cf2EC227122928cD5B23' : 'BaseParty'
    }
}

module.exports = { defi }