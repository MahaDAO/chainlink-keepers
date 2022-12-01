import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { deployOrLoadAndVerify, getOutputAddress } from "../utils";

async function main() {
  console.log(`Deploying to ${network.name}...`);
  const e18 = BigNumber.from(10).pow(18);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address is ${deployer.address}.`);

  const rate = e18.mul(1000);

  const startTime = 1662073200;
  const startEpoch = 3;

  const keeper = await deployOrLoadAndVerify(
    "StabilityPoolKeeper",
    "StabilityPoolKeeper",
    [
      "0xdac4961f0ab8f7326d2d8ff75cfa1dbe29d558ec", // ICommunityIssuance _arthCommunityIssuance,
      rate, // uint256 _mahaRate,
      await getOutputAddress("MAHA", "ethereum"), // IERC20 _maha,
      startTime, // uint256 _startTime,
      startEpoch, // uint256 _startEpoch
    ]
  );

  // await arthCommunityIssuance.transferOwnership(keeper.address);
  console.log(new Date((await keeper.nextEpochPoint()) * 1000));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
