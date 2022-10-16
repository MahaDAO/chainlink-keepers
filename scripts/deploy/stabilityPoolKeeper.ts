import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { deployOrLoadAndVerify, getOutputAddress } from "../utils";

async function main() {
  console.log(`Deploying to ${network.name}...`);
  const e18 = BigNumber.from(10).pow(18);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address is ${deployer.address}.`);

  const arthCommunityIssuance = await ethers.getContractAt(
    "ICommunityIssuance",
    await getOutputAddress("ETHCommunityIssuance", "ethereum")
  );

  const maha = await ethers.getContractAt(
    "IERC20",
    await getOutputAddress("MAHA", "ethereum")
  );
  const rate = e18.mul(1000);

  const startTime = 1662073200;
  const startEpoch = 1;

  const keeper = await deployOrLoadAndVerify(
    "StabilityPoolKeeper",
    "StabilityPoolKeeper",
    [
      arthCommunityIssuance.address, // ICommunityIssuance _arthCommunityIssuance,
      rate, // uint256 _mahaRate,
      maha.address, // IERC20 _maha,
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
