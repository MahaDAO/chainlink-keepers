// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { KeeperCompatibleInterface } from "./interfaces/KeeperCompatibleInterface.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IGaugeVoterV2 } from "./interfaces/IGaugeVoterV2.sol";
import { IEmissionController } from "./interfaces/IEmissionController.sol";
import { IRegistry } from "./interfaces/IRegistry.sol";

/**
 * @dev This keeper contract rewards the caller with MAHA and distributes maha emissions
 * to the various gauges every week.
 */
contract EmissionControllerKeeper is Ownable, KeeperCompatibleInterface {
  IRegistry public registry;
  uint256 public mahaRewardPerEpoch;

  constructor(IRegistry _registry, uint256 _mahaRewardPerEpoch) {
    registry = _registry;
    mahaRewardPerEpoch = _mahaRewardPerEpoch;
  }

  function updateMahaReward(uint256 reward) external onlyOwner {
    mahaRewardPerEpoch = reward;
  }

  function nextUpkeepTime() external view returns (uint256) {
    return IEmissionController(registry.emissionController()).nextEpochPoint();
  }

  function checkUpkeep(bytes calldata)
    external
    view
    override
    returns (bool, bytes memory)
  {
    bool upkeepNeeded;
    if (IEmissionController(registry.emissionController()).callable())
      upkeepNeeded = true;
    else upkeepNeeded = false;
    return (upkeepNeeded, "");
  }

  function performUpkeep(bytes calldata performData) external override {
    IEmissionController(registry.emissionController()).allocateEmission();
    IGaugeVoterV2(registry.gaugeVoter()).distribute();

    // if the keeper wants a maha reward, we provide it with one; usually
    // non-chainlink keepers would ask for a MAHA reward
    if (performData.length > 0) {
      uint256 flag = abi.decode(performData, (uint256));
      if (flag >= 1) {
        require(
          IERC20(registry.maha()).balanceOf(address(this)) >=
            mahaRewardPerEpoch,
          "not enough maha for rewards"
        );
        IERC20(registry.maha()).transfer(msg.sender, mahaRewardPerEpoch);
      }
    }

    emit PerformUpkeep(msg.sender, performData);
  }
}
