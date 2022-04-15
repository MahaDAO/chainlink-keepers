pragma solidity ^0.8.0;

import {IEpoch} from "./interface/IEpoch.sol";
import {IStakingCollector} from "./interface/IStakingCollector.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract Keeper is KeeperCompatibleInterface {
    // bool public nextEpoch;

    function checkUpkeep(bytes calldata checkData)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = IEpoch(0x41Ef0505EBaa70eC10F7b8EE8965E269a50cE3eE)
            .callable();

        performData = checkData;
    }

    function performUpkeep(bytes calldata performData) external view override {
        IStakingCollector(0x41Ef0505EBaa70eC10F7b8EE8965E269a50cE3eE).step();

        performData;
    }
}
