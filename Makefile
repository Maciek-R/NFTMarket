compile:
	npx hardhat compile

test:
	npx hardhat test

deploy_local:
	npx hardhat deploy --network localhost

deploy_rinkeby:
	npx hardhat deploy --network rinkeby


