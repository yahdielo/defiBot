## resorces

- https://ethereum.stackexchange.com/questions/159893/how-to-buy-with-ethers-js-using-uniswap-universal-router-on-base-calling-execut

uniswap official execute function docs
- https://docs.uniswap.org/contracts/universal-router/technical-reference#:~:text=The%20execute%20functions%20work%20like,them%20in%20the%20order%20specified.

- https://medium.com/@solidity101/how-to-purchase-a-token-on-the-uniswap-universal-router-with-solidity-3075ce1468d1

- https://uniswapv3book.com/index.html
## breaking down the function

this is a swap for eth to token: https://basescan.org/tx/0x29cb6b90ceb2065ea407b956275fdf662862ba93d4034b55fa72e5e9c3b12997

this is another swap for eth to token: https://basescan.org/tx/0x20ec67eaa832164da944a24c05ca6adfa9de9c414afaece95dae41f4424728c4

both uniswap v2 pools

this is a swap eth for token on a v3 pool: https://basescan.org/tx/0xf86e79ea7172c480a660b2b4d0e3b14eb69be32b89911d9cb122246e99be345f

Transactions to the UniversalRouter all go through the UniversalRouter.execute functions:

execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline)

 ```
 /// @inheritdoc IUniversalRouter
    function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline)
        external
        payable
        checkDeadline(deadline)
    {
        execute(commands, inputs);
    }
 ```

 for swapping eth to token, meaning in the exachnge the eth is converted to WETH and then swapped to token
 this is always the selector __0x3593564c__