pragma solidity ^0.8.0;

interface IStakingCollector {
    function step() external view returns (uint256);
}
