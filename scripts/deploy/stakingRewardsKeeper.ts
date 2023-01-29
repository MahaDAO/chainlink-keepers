import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { deployOrLoadAndVerify, getOutputAddress } from "../utils";

async function main() {
  console.log(`Deploying to ${network.name}...`);
  const e18 = BigNumber.from(10).pow(18);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address is ${deployer.address}.`);

  const maha = await getOutputAddress("MAHA");
  const sclp = await getOutputAddress("SCLP");

  const mahaDistributor = await getOutputAddress("MAHAFeeDistributor");
  const sclpDistributor = await getOutputAddress("SCLPFeeDistributor");

  const keeper = await deployOrLoadAndVerify(
    "StakingRewardsKeeper",
    "StakingRewardsKeeper",
    [
      [mahaDistributor, sclpDistributor], // IFeeDistributor[] memory _distributors,
      [maha, sclp], // IERC20[] memory _tokens,
      [e18.mul(1000), e18.mul(9615)], // uint256[] memory _tokenRates,
      maha, // IERC20 _maha,
      e18.mul(10), // uint256 _mahaRewardPerEpoch
      "0x6357EDbfE5aDA570005ceB8FAd3139eF5A8863CC", // _owner
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
