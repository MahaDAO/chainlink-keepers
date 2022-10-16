// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {KeeperCompatibleInterface} from "./interfaces/KeeperCompatibleInterface.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IDddIncentiveDistributor} from "./interfaces/IDddIncentiveDistributor.sol";
import {Epoch} from "./utils/Epoch.sol";

/**
 * The stability pool keeper gives the stability pool a MAHA reward every 30 days.
 */
contract DotDotFinanceBribeKeeper is Epoch, KeeperCompatibleInterface {
    uint256 public mahaRate;
    IERC20 public maha;
    IDddIncentiveDistributor public dotdotIncentiveDistributor;
    address public epxLpToken;

    constructor(
        IDddIncentiveDistributor _dotdotIncentiveDistributor,
        address _epxLpToken,
        uint256 _mahaRate,
        IERC20 _maha
    ) Epoch(86400 * 7, block.timestamp, 0) {
        dotdotIncentiveDistributor = _dotdotIncentiveDistributor;
        maha = _maha;
        mahaRate = _mahaRate;
        epxLpToken = _epxLpToken;

        uint256 maxInt = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
        maha.approve(address(_dotdotIncentiveDistributor), maxInt);
    }

    function updateMahaReward(uint256 reward) external onlyOwner {
        mahaRate = reward;
    }

    function checkUpkeep(bytes calldata _checkData)
        external
        view
        override
        returns (bool, bytes memory)
    {
        return (_callable(), "");
    }

    function performUpkeep(bytes calldata performData)
        external
        override
        checkEpoch
    {
        dotdotIncentiveDistributor.depositIncentive(
            epxLpToken,
            address(maha),
            mahaRate
        );
    }

    function refund(IERC20 token) external onlyOwner {
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}
