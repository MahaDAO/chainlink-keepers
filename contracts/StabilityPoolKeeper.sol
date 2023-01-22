// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { KeeperCompatibleInterface } from "./interfaces/KeeperCompatibleInterface.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { ICommunityIssuance } from "./interfaces/ICommunityIssuance.sol";
import { Epoch } from "./utils/Epoch.sol";

/**
 * The stability pool keeper gives the stability pool a MAHA reward every 30 days.
 */
contract StabilityPoolKeeper is Epoch, KeeperCompatibleInterface {
  uint256 public mahaRate;
  IERC20 public maha;
  ICommunityIssuance public arthCommunityIssuance;

  constructor(
    ICommunityIssuance _arthCommunityIssuance,
    uint256 _mahaRate,
    IERC20 _maha,
    uint256 _startTime,
    address _owner
  ) Epoch(86400 * 30, _startTime, 0) {
    arthCommunityIssuance = _arthCommunityIssuance;
    maha = _maha;
    mahaRate = _mahaRate;

    uint256 maxInt = type(uint256).max;
    maha.approve(address(arthCommunityIssuance), maxInt);

    _transferOwnership(_owner);
  }

  function updateMahaReward(uint256 reward) external onlyOwner {
    mahaRate = reward;
  }

  function checkUpkeep(bytes calldata)
    external
    view
    override
    returns (bool, bytes memory)
  {
    return (_callable(), "");
  }

  function performUpkeep(bytes memory performData)
    external
    override
    checkEpoch
  {
    maha.transfer(address(arthCommunityIssuance), mahaRate);
    arthCommunityIssuance.notifyRewardAmount(mahaRate);

    emit PerformUpkeep(msg.sender, performData);
  }

  function refund(IERC20 token) external onlyOwner {
    token.transfer(msg.sender, token.balanceOf(address(this)));
  }

  function transferCommunityIssuanceOwnership(address newOperator_)
    external
    onlyOwner
  {
    arthCommunityIssuance.transferOwnership(newOperator_);
  }
}
