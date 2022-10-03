npx hardhat test

Open ganache

npx hardhat deploy --network localhost

npx hardhat deploy --network rinkeby

Verify (deploying code on etherscan) example:

npx hardhat verify --network rinkeby 0x89C2ccf27Bc9bB8AA1ea9FA0eA987dd5F1F23863 'Unique NFT Asset' UNA 100

//Creating js scripts

browserify public/ipfs.js -o public/bundle.js
