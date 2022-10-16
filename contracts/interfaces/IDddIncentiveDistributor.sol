// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IDddIncentiveDistributor {
    function getLockingWeek() external view returns (uint256);

    function getVotingWeek() external view returns (uint256);

    function incentiveTokensLength(address _lpToken)
        external
        view
        returns (uint256);

    /**
        @notice Deposit incentives into the contract
        @dev Incentives received in a week will be paid out the following week. An
             incentive can be given to all DDD lockers (a "fee"), or to lockers that
             voted for a specific LP token in the current week (a "bribe").
        @param _lpToken The LP token to incentivize voting for. Set to address(0) if
                        you are depositing a fee to distribute to all token lockers.
        @param _incentive Address of the incentive token
        @param _amount Amount of the token to deposit
        @return bool Success
     */
    function depositIncentive(
        address _lpToken,
        address _incentive,
        uint256 _amount
    ) external returns (bool);

    /**
        @notice Get an array of claimable amounts of different tokens accrued from protocol fees
        @param _user Address to query claimable amounts for
        @param _tokens List of tokens to query claimable amounts of
     */
    function claimable(
        address _user,
        address _lpToken,
        address[] calldata _tokens
    ) external view returns (uint256[] memory amounts);

    /**
        @notice Claim an available fee or bribe.
        @dev Incentives are claimable up to the end of the previous week. Incentives earned more
             than one week ago are released immediately, those from the previous week are streamed.
        @param _user Address to claim for
        @param _lpToken LP token that was voted on to earn the incentive. Set to address(0)
                        to claim general fees for all token lockers.
        @param _tokens Array of tokens to claim
        @return claimedAmounts Array of amounts claimed
     */
    function claim(
        address _user,
        address _lpToken,
        address[] calldata _tokens
    ) external returns (uint256[] memory claimedAmounts);
}
