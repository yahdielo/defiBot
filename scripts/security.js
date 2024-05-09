const { GoPlus, ErrorCode } = require("@goplus/sdk-node");

let chainId = "8453";
let addresses = ["0xfd2c1458e6afb14323bfded354c9fc8a1752b433"];

async function security(){
    // It will only return 1 result for the 1st token address if not called getAccessToken before
    let res = await GoPlus.tokenSecurity(chainId, addresses, 30);
    if (res.code != ErrorCode.SUCCESS) {
    console.error(res.message);
    } else {
    console.log(res.result[addresses]);
    }

}
async function rugPull(){
    let address = "0x1370ee832628F8a53e284236b0199FA9A3090997"
    let res = await GoPlus.rugpullDetection(chainId, address, 30);
    if (res.code != ErrorCode.SUCCESS && res.code != ErrorCode.DATA_PENDING_SYNC) {
    console.error(res.message);
    } else {
    console.log(res);
    }
}
rugPull()