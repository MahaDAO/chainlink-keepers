import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { deployOrLoadAndVerify, getOutputAddress } from "../utils";

async function main() {
  console.log(`Deploying to ${network.name}...`);
  const e18 = BigNumber.from(10).pow(18);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address is ${deployer.address}.`);

  const maha = await getOutputAddress("MAHA");
  const rate = e18.mul(1000);

  const startTime = 1664665200;
  const startEpoch = 1;

  await deployOrLoadAndVerify(
    "StabilityPoolKeeper",
    "KeeperCompatibleInterface",
    [
      rate, // uint256 _mahaRate,
      maha, // IERC20 _maha,
      startTime, // uint256 _startTime,
      startEpoch, // uint256 _startEpoch
    ]
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
