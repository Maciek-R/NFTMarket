const {ethers} = require("ethers");
require('../env');

const url = "https://rinkeby.infura.io/v3/" + process.env.INFURA_RINKEBY_KEY;

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