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
    "ARTHPriceKeeper",
    "ARTHPriceKeeper",
    [
      "0x7EE5010Cbd5e499b7d66a7cbA2Ec3BdE5fca8e00", // IGMUOracle _gmuOracle,
      await getOutputAddress("Registry", "ethereum"), // IRegistry _registry,
      rate, // uint256 _mahaRewardPerEpoch
      "0x6357EDbfE5aDA570005ceB8FAd3139eF5A8863CC", // address _governance
    ]
  );

  // await arthCommunityIssuance.transferOwnership(keeper.address);
  console.log(new Date((await keeper.nextUpkeepTime()) * 1000));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
