import hre, { ethers } from 'hardhat';

require('dotenv').config();

async function main() {
    const instance = await ethers.getContractFactory("Keeper");

    console.log('deploying Keeper contract..');

    const keeper = await instance.deploy()

    console.log('Keeper address :-', keeper.address);

    setTimeout(async () => {
        //your code to be executed after 1 second
        await hre.run("verify:verify", {
            address: keeper.address,
            constructorArguments: []
        });
    }, 10000);
}

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });