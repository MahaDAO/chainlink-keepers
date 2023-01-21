import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { deployOrLoadAndVerify, getOutputAddress } from "../utils";

async function main() {
  console.log(`Deploying to ${network.name}...`);
  const e18 = BigNumber.from(10).pow(18);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address is ${deployer.address}.`);

  const rate = e18.mul(1000);

  const startTime = 1675189800;

  const keeper = await deployOrLoadAndVerify(
    "StabilityPoolKeeper",
    "StabilityPoolKeeper",
    [
      "0x61274CD1f801B097BE7E5197b158999307893D2e", // ICommunityIssuance _arthCommunityIssuance,
      rate, // uint256 _mahaRate,
      await getOutputAddress("MAHA", "ethereum"), // IERC20 _maha,
      startTime, // uint256 _startTime,
      await getOutputAddress("MAHATimelockController-14d", "ethereum"), // IERC20 _maha,
    ]
  );

  // await arthCommunityIssuance.transferOwnership(keeper.address);
  console.log(new Date((await keeper.nextEpochPoint()) * 1000));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
