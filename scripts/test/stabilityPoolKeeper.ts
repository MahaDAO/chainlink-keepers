import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import * as helpers from "@nomicfoundation/hardhat-network-helpers";

import { deployOrLoadAndVerify, getOutputAddress } from "../utils";

async function main() {
  console.log(`Deploying to ${network.name}...`);
  const e18 = BigNumber.from(10).pow(18);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address is ${deployer.address}.`);

  const impersonatedSigner = await ethers.getImpersonatedSigner(
    "0x1234567890123456789012345678901234567890"
  );

  const arthCommunityIssuance = await ethers.getContractAt(
    "ICommunityIssuance",
    await getOutputAddress("ETHCommunityIssuance", "ethereum")
  );

  const maha = await ethers.getContractAt(
    "IERC20",
    await getOutputAddress("MAHA", "ethereum")
  );
  const rate = e18.mul(10);

  const startTime = 1664665200;
  const startEpoch = 0;

  console.log(
    arthCommunityIssuance.address, // ICommunityIssuance _arthCommunityIssuance,
    rate, // uint256 _mahaRate,
    maha.address, // IERC20 _maha,
    startTime, // uint256 _startTime,
    startEpoch // uint256 _startEpoch
  );

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

  maha.connect(impersonatedSigner).transfer(deployer.address, e18.mul(10));

  await helpers.time.increase(86400 * 31);
  await helpers.mine();

  await arthCommunityIssuance.transferOwnership(keeper.address);

  console.log(new Date((await keeper.nextEpochPoint()) * 1000));
  console.log(await keeper.checkUpkeep("0x"));
  console.log(await keeper.performUpkeep("0x"));
  console.log(new Date((await keeper.nextEpochPoint()) * 1000));

  await helpers.time.increase(86400 * 31);
  await helpers.mine();

  console.log(new Date((await keeper.nextEpochPoint()) * 1000));
  console.log(await keeper.checkUpkeep("0x"));
  console.log(await keeper.performUpkeep("0x"));
  console.log(new Date((await keeper.nextEpochPoint()) * 1000));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
