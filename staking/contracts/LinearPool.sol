//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

contract LinearPool is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20 for IERC20;
    using SafeCastUpgradeable for uint256;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    uint32 private constant ONE_YEAR_IN_SECONDS = 365 days;

    uint64 public constant LINEAR_MAXIMUM_DELAY_DURATION = 35 days; // maximum 35 days delay

    // tiers
    TierInfo[] public tierInfos;

    // masters
    mapping(address => bool) masters;

    // The accepted token
    IERC20 public linearAcceptedToken;
    // The reward distribution address
    address public linearRewardDistributor;
    // Info of each pool
    LinearPoolInfo[] public linearPoolInfo;
    // Info of each user that stakes in pools
    mapping(uint256 => mapping(address => LinearStakingData))
        public linearStakingData;
    // Info of pending withdrawals.
    mapping(uint256 => mapping(address => LinearPendingWithdrawal))
        public linearPendingWithdrawals;
    // The flexible lock duration. Users who stake in the flexible pool will be affected by this
    uint128 public linearFlexLockDuration;
    // Allow emergency withdraw feature
    bool public linearAllowEmergencyWithdraw;

    // Upgrade: Allow emergency transfer feature
    mapping(address => bool) public linearAllowEmergencyTransfer;

    event LinearPoolCreated(uint256 indexed poolId, uint256 APR);
    event LinearDeposit(
        uint256 indexed poolId,
        address indexed account,
        uint256 amount
    );
    event LinearWithdraw(
        uint256 indexed poolId,
        address indexed account,
        uint256 amount
    );
    event LinearRewardsHarvested(
        uint256 indexed poolId,
        address indexed account,
        uint256 reward
    );
    event LinearPendingWithdraw(
        uint256 indexed poolId,
        address indexed account,
        uint256 amount
    );
    event LinearEmergencyWithdraw(
        uint256 indexed poolId,
        address indexed account,
        uint256 amount
    );

    event LinearRestake(
        uint256 indexed poolId,
        address indexed account,
        uint256 amount
    );

    struct LinearPoolInfo {
        uint128 cap;
        uint128 totalStaked;
        uint128 minInvestment;
        uint128 maxInvestment;
        uint64 APR;
        uint128 lockDuration;
        uint128 delayDuration;
        uint128 startJoinTime;
        uint128 endJoinTime;
        bool useLocalDelayPool;
    }

    struct LinearStakingData {
        uint128 balance;
        uint128 joinTime;
        uint128 updatedTime;
        uint128 reward;
        uint256 exp;
        uint128 unStakedTime;
        uint128 lastWithdrawalTime;
    }

    struct LinearPendingWithdrawal {
        uint128 amount;
        uint128 applicableAt;
    }

    struct TierInfo {
        uint128 threshold;
        uint128 delayDuration;
    }

    /**
     * @notice Initialize the contract, get called in the first time deploy
     * @param _acceptedToken the token that the pools will use as staking and reward token
     */
    function __LinearPool_init(IERC20 _acceptedToken) public initializer {
        __Ownable_init();

        linearAcceptedToken = _acceptedToken;
    }

    /**
     * @notice Validate pool by pool ID
     * @param _poolId id of the pool
     */
    modifier linearValidatePoolById(uint256 _poolId) {
        require(
            _poolId < linearPoolInfo.length,
            "LinearStakingPool: Pool are not exist"
        );
        _;
    }

    /**
     * @notice Return total number of pools
     */
    function linearPoolLength() external view returns (uint256) {
        return linearPoolInfo.length;
    }

    /**
     * @notice Return total tokens staked in a pool
     * @param _poolId id of the pool
     */
    function linearTotalStaked(uint256 _poolId)
        external
        view
        linearValidatePoolById(_poolId)
        returns (uint256)
    {
        return linearPoolInfo[_poolId].totalStaked;
    }

    /**
     * @notice Add a new pool with different APR and conditions. Can only be called by the owner.
     * @param _cap the maximum number of staking tokens the pool will receive. If this limit is reached, users can not deposit into this pool.
     * @param _minInvestment the minimum investment amount users need to use in order to join the pool.
     * @param _maxInvestment the maximum investment amount users can deposit to join the pool.
     * @param _APR the APR rate of the pool.
     * @param _lockDuration the duration users need to wait before being able to withdraw and claim the rewards.
     * @param _delayDuration the duration users need to wait to receive the principal amount, after unstaking from the pool.
     * @param _startJoinTime the time when users can start to join the pool
     * @param _endJoinTime the time when users can no longer join the pool
     */
    function linearAddPool(
        uint128 _cap,
        uint128 _minInvestment,
        uint128 _maxInvestment,
        uint64 _APR,
        uint128 _lockDuration,
        uint128 _delayDuration,
        uint128 _startJoinTime,
        uint128 _endJoinTime
    ) external onlyOwner {
        require(
            _endJoinTime >= block.timestamp && _endJoinTime > _startJoinTime,
            "LinearStakingPool: invalid end join time"
        );
        require(
            _delayDuration <= LINEAR_MAXIMUM_DELAY_DURATION,
            "LinearStakingPool: delay duration is too long"
        );

        linearPoolInfo.push(
            LinearPoolInfo({
                cap: _cap,
                totalStaked: 0,
                minInvestment: _minInvestment,
                maxInvestment: _maxInvestment,
                APR: _APR,
                lockDuration: _lockDuration,
                delayDuration: _delayDuration,
                startJoinTime: _startJoinTime,
                endJoinTime: _endJoinTime,
                useLocalDelayPool: false
            })
        );
        emit LinearPoolCreated(linearPoolInfo.length - 1, _APR);
    }

    /**
     * @notice Update the given pool's info. Can only be called by the owner.
     * @param _poolId id of the pool
     * @param _cap the maximum number of staking tokens the pool will receive. If this limit is reached, users can not deposit into this pool.
     * @param _minInvestment minimum investment users need to use in order to join the pool.
     * @param _maxInvestment the maximum investment amount users can deposit to join the pool.
     * @param _APR the APR rate of the pool.
     * @param _endJoinTime the time when users can no longer join the pool
     */
    function linearSetPool(
        uint128 _poolId,
        uint128 _cap,
        uint128 _minInvestment,
        uint128 _maxInvestment,
        uint64 _APR,
        uint128 _endJoinTime
    ) external onlyOwner linearValidatePoolById(_poolId) {
        LinearPoolInfo storage pool = linearPoolInfo[_poolId];

        require(
            _endJoinTime >= block.timestamp &&
                _endJoinTime > pool.startJoinTime,
            "LinearStakingPool: invalid end join time"
        );

        linearPoolInfo[_poolId].cap = _cap;
        linearPoolInfo[_poolId].minInvestment = _minInvestment;
        linearPoolInfo[_poolId].maxInvestment = _maxInvestment;
        linearPoolInfo[_poolId].APR = _APR;
        linearPoolInfo[_poolId].endJoinTime = _endJoinTime;
    }

    /**
     * @notice Set the flexible lock time. This will affects the flexible pool.  Can only be called by the owner.
     * @param _flexLockDuration the minimum lock duration
     */
    function linearSetFlexLockDuration(uint128 _flexLockDuration)
        external
        onlyOwner
    {
        require(
            _flexLockDuration <= LINEAR_MAXIMUM_DELAY_DURATION,
            "LinearStakingPool: flexible lock duration is too long"
        );
        linearFlexLockDuration = _flexLockDuration;
    }

    /**
     * @notice Set the reward distributor. Can only be called by the owner.
     * @param _linearRewardDistributor the reward distributor
     */
    function linearSetRewardDistributor(address _linearRewardDistributor)
        external
        onlyOwner
    {
        require(
            _linearRewardDistributor != address(0),
            "LinearStakingPool: invalid reward distributor"
        );
        linearRewardDistributor = _linearRewardDistributor;
    }

    /**
     * @notice Set the delay pool. Can only be called by the owner.
     * @param _useLocalDelayPool the delay pool parameter
     */
    function linearSetUseLocalDelayPool(
        uint128 _poolId,
        bool _useLocalDelayPool
    ) external onlyOwner linearValidatePoolById(_poolId) {
        linearPoolInfo[_poolId].useLocalDelayPool = _useLocalDelayPool;
    }

    /**
     * @notice Deposit token to earn rewards
     * @param _poolId id of the pool
     * @param _amount amount of token to deposit
     */
    function linearDeposit(uint256 _poolId, uint128 _amount)
        external
        nonReentrant
        linearValidatePoolById(_poolId)
    {
        address account = msg.sender;
        _linearDeposit(_poolId, _amount, account);

        linearAcceptedToken.safeTransferFrom(account, address(this), _amount);
        emit LinearDeposit(_poolId, account, _amount);
    }

    /**
     * @notice Set the linear info. Can only be called by the owner.
     * @param _thresholds the tier threshold
     * @param _delays the delay time
     */
    function linearInitTierInfo(uint128[] memory _thresholds, uint128[] memory _delays)
    external
    onlyOwner
    {
        require(
            _thresholds.length == _delays.length,
            "LinearStakingPool: Init length not match"
        );

        require(
            tierInfos.length == 0,
            "LinearStakingPool: Init cannot be called more than once"
        );

        for (uint128 index = 0; index < _thresholds.length; index++) {
            tierInfos.push(TierInfo(_thresholds[index], _delays[index]));
        }
    }

    /**
     * @notice Set the linear info. Can only be called by the owner.
     * @param _thresholds the tier threshold
     * @param _delays the delay time
     */
    function linearPushNewTierInfo(uint128 _thresholds, uint128 _delays)
    external
    onlyOwner
    {
        tierInfos.push(TierInfo(_thresholds, _delays));
    }

    /**
     * @notice Set the linear info. Can only be called by the owner.
     * @param _level the tier level
     * @param _threshold the tier threshold
     * @param _delay the delay time
     */
    function linearSetTierInfo(uint128 _level, uint128 _threshold, uint128 _delay)
    external
    onlyOwner
    {
        require(
            tierInfos.length > _level,
            "LinearStakingPool: setTierInfo invalid level"
        );

        tierInfos[_level].threshold = _threshold;
        tierInfos[_level].delayDuration = _delay;
    }

    /**
     * @notice grant the master tier. Can only be called by the owner.
     * @param _masters the address of master
     */
    function linearSetMaster(address[] memory _masters, bool _master)
    external
    onlyOwner
    {
        for (uint128 index; index < _masters.length; index++) {
            masters[_masters[index]] = _master;
        }
    }

    /**
     * @notice Withdraw token from a pool
     * @param _poolId id of the pool
     * @param _amount amount to withdraw
     */
    function linearWithdraw(uint256 _poolId, uint128 _amount)
        external
        nonReentrant
        linearValidatePoolById(_poolId)
    {
        address account = msg.sender;
        LinearPoolInfo storage pool = linearPoolInfo[_poolId];
        LinearStakingData storage stakingData = linearStakingData[_poolId][
            account
        ];

        uint128 lockDuration = pool.lockDuration > 0
            ? pool.lockDuration
            : linearFlexLockDuration;

        require(
            block.timestamp >= stakingData.joinTime + lockDuration,
            "LinearStakingPool: still locked"
        );

        require(
            stakingData.balance >= _amount,
            "LinearStakingPool: invalid withdraw amount"
        );

        _linearHarvest(_poolId, account);

        if (stakingData.reward > 0) {
            require(
                linearRewardDistributor != address(0),
                "LinearStakingPool: invalid reward distributor"
            );

            uint128 reward = stakingData.reward;
            stakingData.reward = 0;
            linearAcceptedToken.safeTransferFrom(
                linearRewardDistributor,
                account,
                reward
            );
            emit LinearRewardsHarvested(_poolId, account, reward);
        }

        // get delayDuration
        uint128 delayDuration = linearDurationOf(_poolId, account);
        stakingData.balance -= _amount;
        emit LinearPendingWithdraw(_poolId, account, _amount);

        if (delayDuration == 0) {
            linearAcceptedToken.safeTransfer(account, _amount);
            stakingData.lastWithdrawalTime = block.timestamp.toUint128();
            emit LinearWithdraw(_poolId, account, _amount);
            return;
        }

        LinearPendingWithdrawal storage pending = linearPendingWithdrawals[
            _poolId
        ][account];

        pending.amount += _amount;
        pending.applicableAt = block.timestamp.toUint128() + delayDuration;
    }

    /**
     * @notice Withdraw token from a pool
     * @param _poolId id of the pool
     */
    function linearReStake(uint256 _poolId)
    external
    nonReentrant
    linearValidatePoolById(_poolId)
    {
        address account = msg.sender;
        LinearPendingWithdrawal storage pending = linearPendingWithdrawals[_poolId][account];
        uint128 _amount = pending.amount;
        require(_amount > 0, "LinearStakingPool: nothing is currently pending");

        _linearDeposit(_poolId, _amount, account);

        emit LinearDeposit(_poolId, account, _amount);
        emit LinearRestake(_poolId, account, _amount);
        delete linearPendingWithdrawals[_poolId][account];
    }

    /**
     * @notice Claim pending withdrawal
     * @param _poolId id of the pool
     */
    function linearClaimPendingWithdraw(uint256 _poolId)
        external
        nonReentrant
        linearValidatePoolById(_poolId)
    {
        address account = msg.sender;
        LinearPendingWithdrawal storage pending = linearPendingWithdrawals[_poolId][account];

        uint128 amount = pending.amount;
        require(amount > 0, "LinearStakingPool: nothing is currently pending");
        require(
            pending.applicableAt <= block.timestamp,
            "LinearStakingPool: not released yet"
        );
        delete linearPendingWithdrawals[_poolId][account];
        linearAcceptedToken.safeTransfer(account, amount);
        linearStakingData[_poolId][account].lastWithdrawalTime = block.timestamp.toUint128();

        emit LinearWithdraw(_poolId, account, amount);
    }

    /**
     * @notice Claim reward token from a pool
     * @param _poolId id of the pool
     */
    function linearClaimReward(uint256 _poolId)
        external
        nonReentrant
        linearValidatePoolById(_poolId)
    {
        address account = msg.sender;
        LinearStakingData storage stakingData = linearStakingData[_poolId][
            account
        ];

        _linearHarvest(_poolId, account);

        if (stakingData.reward > 0) {
            require(
                linearRewardDistributor != address(0),
                "LinearStakingPool: invalid reward distributor"
            );
            uint128 reward = stakingData.reward;
            stakingData.reward = 0;
            linearAcceptedToken.safeTransferFrom(
                linearRewardDistributor,
                account,
                reward
            );
            emit LinearRewardsHarvested(_poolId, account, reward);
        }
    }

    /**
     * @notice Gets number of reward tokens of a user from a pool
     * @param _poolId id of the pool
     * @param _account address of a user
     * @return reward earned reward of a user
     */
    function linearPendingReward(uint256 _poolId, address _account)
        public
        view
        linearValidatePoolById(_poolId)
        returns (uint128 reward)
    {
        LinearPoolInfo storage pool = linearPoolInfo[_poolId];
        LinearStakingData storage stakingData = linearStakingData[_poolId][
            _account
        ];

        uint128 startTime = stakingData.updatedTime > 0
            ? stakingData.updatedTime
            : block.timestamp.toUint128();

        uint128 endTime = block.timestamp.toUint128();
        if (
            pool.lockDuration > 0 &&
            stakingData.joinTime + pool.lockDuration < block.timestamp
        ) {
            endTime = stakingData.joinTime + pool.lockDuration;
        }

        uint128 stakedTimeInSeconds = endTime > startTime
            ? endTime - startTime
            : 0;
        uint128 pendingReward = ((stakingData.balance *
            stakedTimeInSeconds *
            pool.APR) / ONE_YEAR_IN_SECONDS) / 100;

        reward = stakingData.reward + pendingReward;
    }

    /**
     * @notice Gets number of deposited tokens in a pool
     * @param _poolId id of the pool
     * @param _account address of a user
     * @return total token deposited in a pool by a user
     */
    function linearBalanceOf(uint256 _poolId, address _account)
        external
        view
        linearValidatePoolById(_poolId)
        returns (uint128)
    {
        return linearStakingData[_poolId][_account].balance;
    }

    /**
     * @notice Gets the delay duration in a pool by a user
     * @param _poolId id of the pool
     * @param _account address of a user
     * @return the delay duration
     */
    function linearDurationOf(uint256 _poolId, address _account)
        public
        view
        linearValidatePoolById(_poolId)
        returns (uint128)
    {
        // use local delay
        if (linearPoolInfo[_poolId].useLocalDelayPool) {
            return linearPoolInfo[_poolId].delayDuration;
        }

        // use global delay
        if (tierInfos.length < 1) {
            return 0;
        }

        if (masters[_account]) {
            return tierInfos[tierInfos.length - 1].delayDuration;
        }

        uint128 balance = linearStakingData[_poolId][_account].balance;
        balance += linearPendingWithdrawals[_poolId][_account].amount;

        // case tierInfos.length - 1 is in whitelist (masters)
        uint128 delay = 0;
        for (uint256 index = 0; index < tierInfos.length - 1; index++) {
            if (balance >= tierInfos[index].threshold) {
                delay = tierInfos[index].delayDuration;
            }
        }

        return delay;
    }

    /**
     * @notice Update allowance for emergency withdraw
     * @param _shouldAllow should allow emergency withdraw or not
     */
    function linearSetAllowEmergencyWithdraw(bool _shouldAllow)
        external
        onlyOwner
    {
        linearAllowEmergencyWithdraw = _shouldAllow;
    }

    /**
     * @notice Withdraw without caring about rewards. EMERGENCY ONLY.
     * @param _poolId id of the pool
     */
//    function linearEmergencyWithdraw(uint256 _poolId)
//        external
//        nonReentrant
//        linearValidatePoolById(_poolId)
//    {
//        require(
//            linearAllowEmergencyWithdraw,
//            "LinearStakingPool: emergency withdrawal is not allowed yet"
//        );
//
//        address account = msg.sender;
//        LinearStakingData storage stakingData = linearStakingData[_poolId][
//            account
//        ];
//
//        require(
//            stakingData.balance > 0,
//            "LinearStakingPool: nothing to withdraw"
//        );
//
//        uint128 amount = stakingData.balance;
//
//        stakingData.balance = 0;
//        stakingData.reward = 0;
//        stakingData.updatedTime = block.timestamp.toUint128();
//
//        linearAcceptedToken.safeTransfer(account, amount);
//        emit LinearEmergencyWithdraw(_poolId, account, amount);
//    }

    function _linearDeposit(
        uint256 _poolId,
        uint128 _amount,
        address account
    ) internal {
        LinearPoolInfo storage pool = linearPoolInfo[_poolId];
        LinearStakingData storage stakingData = linearStakingData[_poolId][
            account
        ];

        require(
            block.timestamp >= pool.startJoinTime,
            "LinearStakingPool: pool is not started yet"
        );

        require(
            block.timestamp <= pool.endJoinTime,
            "LinearStakingPool: pool is already closed"
        );

        require(
            stakingData.balance + _amount >= pool.minInvestment,
            "LinearStakingPool: insufficient amount"
        );

        if (pool.maxInvestment > 0) {
            require(
                stakingData.balance + _amount <= pool.maxInvestment,
                "LinearStakingPool: too large amount"
            );
        }

        if (pool.cap > 0) {
            require(
                pool.totalStaked + _amount <= pool.cap,
                "LinearStakingPool: pool is full"
            );
        }

        _linearHarvest(_poolId, account);

        stakingData.balance += _amount;
        stakingData.joinTime = block.timestamp.toUint128();

        pool.totalStaked += _amount;
    }

    function _linearHarvest(uint256 _poolId, address _account) private {
        LinearStakingData storage stakingData = linearStakingData[_poolId][
            _account
        ];

        uint256 lastUpdatedTime = uint256(stakingData.updatedTime);

        stakingData.reward = linearPendingReward(_poolId, _account);
        stakingData.updatedTime = block.timestamp.toUint128();

        // calculate exp
        uint256 stakedTime = lastUpdatedTime > block.timestamp ? 0 : block.timestamp - lastUpdatedTime;
        uint256 stakedTimeInSeconds = lastUpdatedTime == 0 ? 0 : stakedTime;
        stakingData.exp += stakingData.balance * stakedTimeInSeconds / 1e5;
    }

    /**
     * UPGRADE
     * @notice Update allowance for emergency transfer
     * @param account user's wallet address
     * @param _shouldAllow should allow emergency transfer or not
     */
    function linearSetAllowEmergencyTransfer(address account, bool _shouldAllow)
    external
    onlyOwner
    {
        linearAllowEmergencyTransfer[account] = _shouldAllow;
    }

    /**
     * UPGRADE
     * @notice Withdraw and transfer to another wallet without caring about rewards. EMERGENCY ONLY.
     * @param _poolId id of the pool
     * @param _recipient recipient of the fund
     */
    function linearEmergencyTransfer(uint256 _poolId, address _recipient)
    external
    linearValidatePoolById(_poolId)
    {
        require(
            linearAllowEmergencyTransfer[msg.sender] || linearAllowEmergencyWithdraw,
            "LinearStakingPool: emergency transfer is not allowed yet"
        );

        address account = msg.sender;
        LinearStakingData storage stakingData = linearStakingData[_poolId][
            account
        ];

        require(
            stakingData.balance > 0,
            "LinearStakingPool: nothing to withdraw"
        );

        uint128 amount = stakingData.balance;

        stakingData.balance = 0;
        stakingData.reward = 0;
        stakingData.updatedTime = block.timestamp.toUint128();

        linearAcceptedToken.safeTransfer(_recipient, amount);
        emit LinearEmergencyWithdraw(_poolId, account, amount);
    }
}
