import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { deployOrLoadAndVerify, getOutputAddress } from "../utils";

async function main() {
  console.log(`Deploying to ${network.name}...`);
  const e18 = BigNumber.from(10).pow(18);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address is ${deployer.address}.`);

  const dotDotIncentiveDistributor = await getOutputAddress(
    "DotDotIncentiveDistributor"
  );

  const epxLpToken = await getOutputAddress("EPXLpToken");

  const maha = await getOutputAddress("MAHA");
  const rate = e18.mul(500);

  const keeper = await deployOrLoadAndVerify(
    "DotDotFinanceBribeKeeper",
    "DotDotFinanceBribeKeeper",
    [
      dotDotIncentiveDistributor, // IDddIncentiveDistributor _dotdotIncentiveDistributor,
      epxLpToken, // address _epxLpToken,
      rate, // uint256 _mahaRate,
      maha, // IERC20 _maha
    ]
  );

  console.log(
    "next epoch is at",
    new Date((await keeper.nextEpochPoint()) * 1000)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
