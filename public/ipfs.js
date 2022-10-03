const {ethers} = require("ethers");

const url = "https://wispy-quick-gas.rinkeby.discover.quiknode.pro/e041c4c256f6a3b6b697aac7ed8280cf0456b4aa";

const provider = new ethers.providers.JsonRpcProvider(url);
const contractTokenAddress  = '0x461fdC8342c38858f5b542999612Bf0dae26efCC';
const {abi} = require('../artifacts/contracts/NFTUniqueAsset.sol/NFTUniqueAsset.json');

const contract = new ethers.Contract(contractTokenAddress,abi,provider);

document.getElementById("searchNft").onclick = function () {
    let tokenId = document.getElementById("inputTokenId").value;

    contract.tokenURI(tokenId).then((url) => {
        location.href = url;
    });
}