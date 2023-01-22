import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { deployOrLoadAndVerify, getOutputAddress } from "../utils";

async function main() {
  console.log(`Deploying to ${network.name}...`);
  const e18 = BigNumber.from(10).pow(18);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address is ${deployer.address}.`);

  const rate = e18.mul(10);

  const keeper = await deployOrLoadAndVerify(
    "EmissionControllerKeeper",
    "EmissionControllerKeeper",
    [
      await getOutputAddress("Registry", "ethereum"), // IRegistry _registry,
      rate, // uint256 _mahaRewardPerEpoch
    ]
  );

  // await arthCommunityIssuance.transferOwnership(keeper.address);
  console.log(new Date((await keeper.nextEpochPoint()) * 1000));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
