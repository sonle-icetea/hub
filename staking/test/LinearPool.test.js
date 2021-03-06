const chai = require('chai');
const { ethers } = require("hardhat");
const { utils, BigNumber } = ethers;
const { expect } = chai;
const { duration } = require("./utilities/time.js");
const {
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,
} = require('@openzeppelin/test-helpers');

describe("Linear Pool ", function () {
  before(async function () {
    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
    this.minter = this.signers[4];

    this.LinearPool = await ethers.getContractFactory("LinearPool");
  });
  beforeEach(async function () {
    this.AcceptedToken = await ethers.getContractFactory("ERC20Mock", this.minter);
    this.pkf = await this.AcceptedToken.deploy("PolkaFoundry", "PKF", utils.parseEther("1000000000"));
    await this.pkf.deployed();
  });

  context("With flexible pool", function () {
    beforeEach(async function () {
      await this.pkf.transfer(this.alice.address, utils.parseEther("1000"));
      await this.pkf.transfer(this.bob.address, utils.parseEther("1000"));
      await this.pkf.transfer(this.carol.address, utils.parseEther("1000"));
    });

    it("should allow emergency withdraw", async function () {
      // default flexible pool with 5% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        5,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );

      await this.pool.linearSetUseLocalDelayPool(0, true);

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));

      await expectRevert(
        this.pool.connect(this.alice).linearEmergencyWithdraw(0),
        "LinearStakingPool: emergency withdrawal is not allowed yet"
      );

      await this.pool.linearSetAllowEmergencyWithdraw(true);

      await this.pool.connect(this.alice).linearEmergencyWithdraw(0);

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));
    });
    it("should not allow admin set delay duration too long", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();

      await expectRevert(
        this.pool.linearAddPool(
          0,
          0,
          0,
          5,
          0,
          duration.days(36).toNumber(),
          (await time.latest()).toNumber(),
          (await time.latest()).toNumber() + duration.years(1).toNumber()
        ),
        "LinearStakingPool: delay duration is too long"
      );

      await this.pool.linearAddPool(
        0,
        0,
        0,
        5,
        0,
        duration.days(15).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );
    });
    it("should distribute pkfs properly for each staker", async function () {
      // default flexible pool with 5% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        5,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );

      await this.pool.linearSetUseLocalDelayPool(0, true);

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 100 tokens at time Delta
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });
      let delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      await time.increaseTo(duration.days(365).add(delta.toString()).toNumber());
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("100"));
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(Number("5").toFixed(2));

      // Alice withdraws 100 tokens at time Delta + 2 year.
      await time.increaseTo(duration.days(365 * 2).add(delta.toString()).toNumber());
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address });
      await time.increase(duration.days(7).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimPendingWithdraw(0, { from: this.alice.address });
      // Alice should have: 1000 + 2 * 5% * 100 = 1010
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address))).toFixed(2)).to.equal(Number("1010").toFixed(2));

    });
    it("should not allow user to withdraw before waiting delay time", async function () {
      // default flexible pool with 5% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        5,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );

      await this.pool.linearSetUseLocalDelayPool(0, true);

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 100 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address })

      // Alice should not be able to claim withdraw after 4 days.
      await time.increase(duration.days(4).toNumber());
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearClaimPendingWithdraw(0, { from: this.alice.address }),
        "LinearStakingPool: not released yet"
      );

      // Alice should be able to withdraw after 3 more days.
      await time.increase(duration.days(3).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimPendingWithdraw(0, { from: this.alice.address });
    });
    it("should allow user to deposit multiple times", async function () {
      // flexible pool with 100% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        100,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(10).toNumber()
      );

      await this.pool.linearSetUseLocalDelayPool(0, true);

      await this.pkf.connect(this.minter).transfer(this.alice.address, utils.parseEther("9000"));
      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("10000"), {
        from: this.alice.address,
      });

      // Alice deposits 1000 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("1000"), { from: this.alice.address });
      let delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("9000"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("1000"));

      // After 1 day, Alice deposits 2000 tokens
      await time.increaseTo(duration.days(1).add(delta.toString()).toNumber());
      expect(await this.pool.linearPendingReward(0, this.alice.address)).to.equal(BigNumber.from(utils.parseEther("1000")).div("365"));
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("2000"), { from: this.alice.address });
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("7000"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("3000"));

      // After 1 day, Alice claims pending rewards
      await time.increase(duration.days(1).toNumber());
      // Rounding to 2-digit number, because dealing with time in block chain is fkin hard
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(
        Number(utils.formatEther(BigNumber.from(utils.parseEther("1000")).div("365").add(BigNumber.from(utils.parseEther("3000")).div("365")))).toFixed(2)
      );
      await this.pool
        .connect(this.alice)
        .linearClaimReward(0, { from: this.alice.address });

      await time.increase(duration.days(1).toNumber());
      // Rounding to 2-digit number, because dealing with time in block chain is fkin hard
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(
        Number(utils.formatEther(BigNumber.from(utils.parseEther("3000")).div("365"))).toFixed(2)
      );
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("1000"), { from: this.alice.address });

      await time.increase(duration.days(1).toNumber());
      // Rounding to 2-digit number, because dealing with time in block chain is fkin hard
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(
        Number(utils.formatEther(BigNumber.from(utils.parseEther("2000")).div("365"))).toFixed(2)
      );
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("2000"), { from: this.alice.address });
      await this.pool
        .connect(this.alice)
        .linearClaimReward(0, { from: this.alice.address });

      await time.increase(duration.days(1).toNumber());
      // Rounding to 2-digit number, because dealing with time in block chain is fkin hard
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(
        Number(utils.formatEther(BigNumber.from(utils.parseEther("4000")).div("365"))).toFixed(2)
      );
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("4000"), { from: this.alice.address });

      await time.increase(duration.days(7).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimPendingWithdraw(0, { from: this.alice.address });

      // Rounding to 2-digit number, because dealing with time in block chain is fkin hard
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address))).toFixed(2)).to.equal(Number(utils.formatEther(BigNumber.from(
        utils.parseEther("10000")
          .add(utils.parseEther("1000").div("365"))
          .add(utils.parseEther("3000").div("365"))
          .add(utils.parseEther("3000").div("365"))
          .add(utils.parseEther("2000").div("365"))
          .add(utils.parseEther("4000").div("365"))
      ))).toFixed(2));

    });
    // it("should allow user to switch to another pool", async function () {
    //   this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
    //     initializer: '__LinearPool_init'
    //   });
    //   await this.pool.deployed();
    //   await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
    //   await this.pool.linearSetRewardDistributor(this.minter.address);
    //   await this.pool.linearAddPool(
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     duration.days(7).toNumber(),
    //     (await time.latest()).toNumber(),
    //     (await time.latest()).toNumber() + duration.years(1).toNumber()
    //   );
    //   await this.pool.linearAddPool(
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     duration.days(14).toNumber(),
    //     (await time.latest()).toNumber(),
    //     (await time.latest()).toNumber() + duration.years(1).toNumber()
    //   );
    //   expect(await this.pool.linearPoolLength()).to.equal(2);
    //
    //   await this.pool.linearSetUseLocalDelayPool(0, true);
    //   await this.pool.linearSetUseLocalDelayPool(1, true);
    //
    //   await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
    //     from: this.alice.address,
    //   });
    //
    //   // Alice deposits 100 tokens to the 1st pool
    //   await this.pool
    //     .connect(this.alice)
    //     .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });
    //   expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));
    //
    //   // Alice deposits 200 tokens to the 2nd pool
    //   await this.pool
    //     .connect(this.alice)
    //     .linearDeposit(1, utils.parseEther("200"), { from: this.alice.address });
    //   expect(await this.pool.linearTotalStaked(1)).to.equal(utils.parseEther("200"));
    //
    //   // Alice switches tokens from the 1st to the 2nd pool
    //   await this.pool
    //     .connect(this.alice)
    //     .linearSwitch(0, 1, { from: this.alice.address });
    //   expect(await this.pool.linearTotalStaked(1)).to.equal(utils.parseEther("300"));
    //
    //   await this.pool
    //     .connect(this.alice)
    //     .linearWithdraw(1, utils.parseEther("300"), { from: this.alice.address })
    //
    //   // Alice should not be able to claim withdraw after 10 days.
    //   await time.increase(duration.days(10).toNumber());
    //   await expectRevert(
    //     this.pool
    //       .connect(this.alice)
    //       .linearClaimPendingWithdraw(1, { from: this.alice.address }),
    //     "LinearStakingPool: not released yet"
    //   );
    //
    //   // Alice should be able to withdraw after 4 more days.
    //   await time.increase(duration.days(4).toNumber());
    //   await this.pool
    //     .connect(this.alice)
    //     .linearClaimPendingWithdraw(1, { from: this.alice.address });
    // });
    // it("should allow user to deposit for another user", async function () {
    //   this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
    //     initializer: '__LinearPool_init'
    //   });
    //   await this.pool.deployed();
    //   await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
    //   await this.pool.linearSetRewardDistributor(this.minter.address);
    //   await this.pool.linearAddPool(
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     duration.days(7).toNumber(),
    //     (await time.latest()).toNumber(),
    //     (await time.latest()).toNumber() + duration.years(1).toNumber()
    //   );
    //   await this.pool.linearSetUseLocalDelayPool(0, true);
    //
    //   await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
    //     from: this.alice.address,
    //   });
    //
    //   await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
    //     from: this.bob.address,
    //   });
    //
    //   // Alice deposits 100 tokens to the 1st pool
    //   await this.pool
    //     .connect(this.alice)
    //     .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });
    //   expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));
    //   expect((await this.pool.linearStakingData(0, this.alice.address))['balance']).to.equal(utils.parseEther("100"));
    //
    //   // Bob deposits 200 tokens for Alice
    //   await this.pool
    //     .connect(this.bob)
    //     .linearDepositFor(0, utils.parseEther("200"), this.alice.address, { from: this.bob.address });
    //
    //   expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("300"));
    //   expect((await this.pool.linearStakingData(0, this.alice.address))['balance']).to.equal(utils.parseEther("300"));
    //   expect((await this.pool.linearStakingData(0, this.bob.address))['balance']).to.equal(utils.parseEther("0"));
    //
    // });

    it("should distribute pkfs on tiers", async function () {
      // default flexible pool with 5% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
          0,
          0,
          0,
          0,
          0,
          0,
          (await time.latest()).toNumber(),
          (await time.latest()).toNumber() + duration.years(1).toNumber()
      );
      await this.pool.linearInitTierInfo(
          [utils.parseEther("1"), utils.parseEther("5"), utils.parseEther("10"), utils.parseEther("50")],
          [duration.days(1), duration.days(3), duration.days(5), duration.days(7)]
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 1000 tokens at time Delta
      await this.pool
          .connect(this.alice)
          .linearDeposit(0, utils.parseEther("2"), { from: this.alice.address });

      // test rookie alice
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("998"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("2"));
      // lock 1 days
      expect(await this.pool.connect(this.alice).linearDurationOf(0, this.alice.address)).to.equal(duration.days("1"));
      this.pool.connect(this.alice).linearWithdraw(0, utils.parseEther("2"))
      let delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("998"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("0"));
      await expectRevert(
          this.pool.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      // lock rookie 1days
      await time.increaseTo(duration.days(1).add(delta.toString()).toNumber() + 1);
      await this.pool.connect(this.alice).linearClaimPendingWithdraw(0);
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));

      // increase to elite
      await this.pool.connect(this.alice).linearDeposit(0, utils.parseEther("5"))
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("995"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("5"));
      expect(await this.pool.connect(this.alice).linearDurationOf(0, this.alice.address)).to.equal(duration.days("3"));
      await this.pool.connect(this.alice).linearWithdraw(0, utils.parseEther("5"));
      delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("995"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("0"));
      await expectRevert(
          this.pool.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      await time.increaseTo(duration.days(3).add(delta.toString()).toNumber() + 1);
      await this.pool.connect(this.alice).linearClaimPendingWithdraw(0);
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));

      // increase to pro
      await this.pool.connect(this.alice).linearDeposit(0, utils.parseEther("10"))
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("10"));
      expect(await this.pool.connect(this.alice).linearDurationOf(0, this.alice.address)).to.equal(duration.days("5"));
      await this.pool.connect(this.alice).linearWithdraw(0, utils.parseEther("10"));
      delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("0"));
      await expectRevert(
          this.pool.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      await time.increaseTo(duration.days(5).add(delta.toString()).toNumber() + 1);
      await this.pool.connect(this.alice).linearClaimPendingWithdraw(0);
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));

      // increase to master (but not nft)
      await this.pool.connect(this.alice).linearDeposit(0, utils.parseEther("100"))
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("100"));
      expect(await this.pool.connect(this.alice).linearDurationOf(0, this.alice.address)).to.equal(duration.days("5"));
      await this.pool.connect(this.alice).linearWithdraw(0, utils.parseEther("100"));
      delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("0"));
      await expectRevert(
          this.pool.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      await time.increaseTo(duration.days(5).add(delta.toString()).toNumber() + 1);
      await this.pool.connect(this.alice).linearClaimPendingWithdraw(0);
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));

      // increase to master (with NFT)
      await this.pool.connect(this.alice).linearDeposit(0, utils.parseEther("100"))
      await this.pool.linearSetMaster([this.alice.address], true)
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("100"));
      expect(await this.pool.connect(this.alice).linearDurationOf(0, this.alice.address)).to.equal(duration.days("7"));
      await this.pool.connect(this.alice).linearWithdraw(0, utils.parseEther("100"));
      delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("0"));
      await expectRevert(
          this.pool.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      await time.increaseTo(duration.days(7).add(delta.toString()).toNumber() + 1);
      await this.pool.connect(this.alice).linearClaimPendingWithdraw(0);
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));
    });
  });

  context("With fixed pool", function () {
    beforeEach(async function () {
      await this.pkf.transfer(this.alice.address, utils.parseEther("1000"));
      await this.pkf.transfer(this.bob.address, utils.parseEther("1000"));
      await this.pkf.transfer(this.carol.address, utils.parseEther("1000"));
    });
    it("should distribute pkfs properly for each staker", async function () {
      // fixed pool with 20% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        20,
        duration.years(1).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(7).toNumber()
      );
      await this.pool.linearSetUseLocalDelayPool(0, true);

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });

      // Alice deposits 100 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      // Bob deposits 200 tokens
      await this.pool
        .connect(this.bob)
        .linearDeposit(0, utils.parseEther("200"), { from: this.bob.address });
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("800"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("300"));

      // After 1 years
      await time.increase(duration.years(1).toNumber());
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("100"));
      expect(await this.pool.linearPendingReward(0, this.alice.address)).to.equal(utils.parseEther("20"));
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("800"));
      expect(await this.pool.linearBalanceOf(0, this.bob.address)).to.equal(utils.parseEther("200"));
      expect(await this.pool.linearPendingReward(0, this.bob.address)).to.equal(utils.parseEther("40"));

      // Alice withdraws 100 tokens. Alice should receive all the interest.
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address });
      // Alice should have: 1000 + 20% * 100 = 1020
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1020"));

      // Bob withdraws 100 tokens. Bob should receive all the interest.
      await this.pool
        .connect(this.bob)
        .linearWithdraw(0, utils.parseEther("200"), { from: this.bob.address });
      // Bob should have: 1000 + 20% * 200 = 1040
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("1040"));
    });
    it("should allow user to withdraw multiple time", async function () {
      // default flexible pool with 5% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
          0,
          0,
          0,
          0,
          0,
          0,
          (await time.latest()).toNumber(),
          (await time.latest()).toNumber() + duration.years(1).toNumber()
      );
      await this.pool.linearInitTierInfo(
          [utils.parseEther("1"), utils.parseEther("5"), utils.parseEther("10"), utils.parseEther("50")],
          [duration.days(1), duration.days(3), duration.days(5), duration.days(7)]
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 1000 tokens at time Delta
      await this.pool
          .connect(this.alice)
          .linearDeposit(0, utils.parseEther("10"), { from: this.alice.address });

      // test rookie alice
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("10"));
      // lock 1 days
      expect(await this.pool.connect(this.alice).linearDurationOf(0, this.alice.address)).to.equal(duration.days("5"));
      this.pool.connect(this.alice).linearWithdraw(0, utils.parseEther("10"))
      let delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("0"));
      await expectRevert(
          this.pool.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      // lock rookie 1days
      await time.increaseTo(duration.days(5).add(delta.toString()).toNumber() + 5);
      await this.pool.connect(this.alice).linearClaimPendingWithdraw(0);
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));

      // increase to pro
      await this.pool.connect(this.alice).linearDeposit(0, utils.parseEther("10"))
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("10"));
      expect(await this.pool.connect(this.alice).linearDurationOf(0, this.alice.address)).to.equal(duration.days("5"));

      await this.pool.connect(this.alice).linearWithdraw(0, utils.parseEther("5"));
      delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("5"));
      await expectRevert(
          this.pool.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      await this.pool.connect(this.alice).linearWithdraw(0, utils.parseEther("5"));
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("0"));

      await time.increaseTo(duration.days(4).add(delta.toString()).toNumber() + 1);
      await expectRevert(
          this.pool.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      await time.increaseTo(duration.days(5).add(delta.toString()).toNumber() + 1);
      await this.pool.connect(this.alice).linearClaimPendingWithdraw(0);
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));
    });
    it("should not allow user to withdraw before lock time end", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        20,
        duration.years(1).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(7).toNumber()
      );
      await this.pool.linearSetUseLocalDelayPool(0, true);

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });

      // Alice deposits 100 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      // Bob deposits 200 tokens
      await this.pool
        .connect(this.bob)
        .linearDeposit(0, utils.parseEther("200"), { from: this.bob.address });
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("800"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("300"));

      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address }),
        "LinearStakingPool: still locked"
      );

      await expectRevert(
        this.pool
          .connect(this.bob)
          .linearWithdraw(0, utils.parseEther("200"), { from: this.bob.address }),
        "LinearStakingPool: still locked"
      );

      // After 1 years
      await time.increase(duration.years(1).toNumber());

      // Alice withdraws 100 tokens 
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address });
      // Alice should have: 1000 + 20% * 100 = 1020
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1020"));

      // Bob withdraws 100 tokens 
      await this.pool
        .connect(this.bob)
        .linearWithdraw(0, utils.parseEther("200"), { from: this.bob.address });
      // Bob should have: 1000 + 20% * 200 = 1040
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("1040"));
    });
    it("should allow user to withdraw multiple time", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
          0,
          0,
          0,
          20,
          duration.years(1).toNumber(),
          0,
          (await time.latest()).toNumber(),
          (await time.latest()).toNumber() + duration.days(7).toNumber()
      );
      await this.pool.linearSetUseLocalDelayPool(0, true);

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });

      // Alice deposits 100 tokens
      await this.pool
          .connect(this.alice)
          .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      // Bob deposits 200 tokens
      await this.pool
          .connect(this.bob)
          .linearDeposit(0, utils.parseEther("200"), { from: this.bob.address });
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("800"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("300"));

      await expectRevert(
          this.pool
              .connect(this.alice)
              .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address }),
          "LinearStakingPool: still locked"
      );

      await expectRevert(
          this.pool
              .connect(this.bob)
              .linearWithdraw(0, utils.parseEther("200"), { from: this.bob.address }),
          "LinearStakingPool: still locked"
      );

      // After 1 years
      await time.increase(duration.years(1).toNumber());

      // Alice withdraws 100 tokens
      await this.pool
          .connect(this.alice)
          .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address });
      // Alice should have: 1000 + 20% * 100 = 1020
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1020"));

      // Bob withdraws 100 tokens
      await this.pool
          .connect(this.bob)
          .linearWithdraw(0, utils.parseEther("200"), { from: this.bob.address });
      // Bob should have: 1000 + 20% * 200 = 1040
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("1040"));
    });
    it("should allow user to claim reward multiple times", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        365,
        duration.days(300).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(7).toNumber()
      );
      await this.pool.linearSetUseLocalDelayPool(0, true);

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 100 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address }),
        "LinearStakingPool: still locked"
      );

      // Alice could claim reward at anytime
      await time.increase(duration.days(100).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimReward(0, { from: this.alice.address });

      await time.increase(duration.days(100).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimReward(0, { from: this.alice.address });

      // After 1 years
      await time.increase(duration.days(100).toNumber());

      // Alice withdraws 100 tokens 
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address });
      // Alice should have: 1000 + 1% * 300 * 100 = 1300
      // Allow a small amount of difference, due to the rounding in calculation
      // The amount of difference should be less than 250 wei
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address)))).to.equal(1300);

    });
    it("should not allow user to deposit after end join time", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        20,
        duration.years(1).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(7).toNumber()
      );
      await this.pool.linearSetUseLocalDelayPool(0, true);

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });

      await time.increase(duration.days(8).toNumber());
      // Alice should not be able to deposit
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address }),
        "LinearStakingPool: pool is already closed"
      );
      // Bob should not be able to deposit
      await expectRevert(
        this.pool
          .connect(this.bob)
          .linearDeposit(0, utils.parseEther("200"), { from: this.bob.address }),
        "LinearStakingPool: pool is already closed"
      );

    });
    it("should verify the staking amount correctly", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        utils.parseEther("800"),
        utils.parseEther("200"),
        utils.parseEther("500"),
        20,
        duration.years(1).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(7).toNumber()
      );
      await this.pool.linearSetUseLocalDelayPool(0, true);

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });
      await this.pkf.connect(this.carol).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.carol.address,
      });

      // Alice should not be able to deposit 100 token
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address }),
        "LinearStakingPool: insufficient amount"
      );

      // Alice should not be able to deposit 600 token
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearDeposit(0, utils.parseEther("600"), { from: this.alice.address }),
        "LinearStakingPool: too large amount"
      );

      // Alice should be able to deposit 500 token
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("500"), { from: this.alice.address });

      // Bob should not be able to deposit 500 token
      await expectRevert(
        this.pool
          .connect(this.bob)
          .linearDeposit(0, utils.parseEther("500"), { from: this.bob.address }),
        "LinearStakingPool: pool is full"
      );

      // Bob should be able to deposit 250 token
      await this.pool
        .connect(this.bob)
        .linearDeposit(0, utils.parseEther("250"), { from: this.bob.address });
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("750"));

      // Bob should not be able to deposit 200 token
      await expectRevert(
        this.pool
          .connect(this.bob)
          .linearDeposit(0, utils.parseEther("200"), { from: this.bob.address }),
        "LinearStakingPool: pool is full"
      );
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("750"));

      // Carol should not be able to deposit 200 token
      await expectRevert(
        this.pool
          .connect(this.carol)
          .linearDeposit(0, utils.parseEther("200"), { from: this.carol.address }),
        "LinearStakingPool: pool is full"
      );
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("750"));

      // Carol should not be able to deposit 50 token
      await expectRevert(
        this.pool
          .connect(this.carol)
          .linearDeposit(0, utils.parseEther("50"), { from: this.carol.address }),
        "LinearStakingPool: insufficient amount"
      );
    });
    it("should upgradable", async function () {
      const LinearPoolV1 = await ethers.getContractFactory("LinearPoolV1");
      const LinearPool = await ethers.getContractFactory("LinearPool");

      const instance = await upgrades.deployProxy(LinearPoolV1, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await instance.deployed();

      await this.pkf.connect(this.minter).approve(instance.address, utils.parseEther("10000"));
      await instance.linearSetRewardDistributor(this.minter.address);
      await instance.linearAddPool(
          0,
          0,
          0,
          0,
          0,
          0,
          (await time.latest()).toNumber(),
          (await time.latest()).toNumber() + duration.years(1).toNumber()
      );
      await instance.linearInitTierInfo(
          [utils.parseEther("1"), utils.parseEther("5"), utils.parseEther("10"), utils.parseEther("50")],
          [duration.days(1), duration.days(3), duration.days(5), duration.days(7)]
      );

      await this.pkf.connect(this.alice).approve(instance.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 1000 tokens at time Delta
      await instance.connect(this.alice).linearDeposit(0, utils.parseEther("10"), { from: this.alice.address });

      // test rookie alice
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await instance.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("10"));
      // lock 1 days
      expect(await instance.connect(this.alice).linearDurationOf(0, this.alice.address)).to.equal(duration.days("5"));
      instance.connect(this.alice).linearWithdraw(0, utils.parseEther("10"))
      let delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await instance.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("0"));
      await expectRevert(
          instance.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      // lock rookie 1days
      await time.increaseTo(duration.days(5).add(delta.toString()).toNumber() + 5);
      await instance.connect(this.alice).linearClaimPendingWithdraw(0);
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));

      // increase to pro
      await instance.connect(this.alice).linearDeposit(0, utils.parseEther("10"))
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await instance.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("10"));
      expect(await instance.connect(this.alice).linearDurationOf(0, this.alice.address)).to.equal(duration.days("5"));

      await instance.connect(this.alice).linearWithdraw(0, utils.parseEther("5"));
      delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await instance.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("5"));
      await expectRevert(
          instance.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      await instance.connect(this.alice).linearWithdraw(0, utils.parseEther("5"));
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await instance.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("0"));

      await time.increaseTo(duration.days(2).add(delta.toString()).toNumber() + 1);
      await expectRevert(
          instance.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      await time.increaseTo(duration.days(3).add(delta.toString()).toNumber() + 1);
      await instance.connect(this.alice).linearClaimPendingWithdraw(0);
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));

      // increase to pro
      await instance.connect(this.alice).linearDeposit(0, utils.parseEther("10"))
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("990"));
      expect(await instance.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("10"));
      expect(await instance.connect(this.alice).linearDurationOf(0, this.alice.address)).to.equal(duration.days("5"));
      await instance.connect(this.alice).linearWithdraw(0, utils.parseEther("5"));

      const upgraded = await upgrades.upgradeProxy(instance.address, LinearPool);
      expect((await upgraded.linearAcceptedToken())).to.equal(this.pkf.address);
      expect(await upgraded.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("5"));
      expect((await upgraded.linearPendingWithdrawals(0, this.alice.address)).amount).to.equal(utils.parseEther("5"));
      await upgraded.connect(this.alice).linearWithdraw(0, utils.parseEther("5"));
      delta = await time.latest();
      await time.increaseTo(duration.days(4).add(delta.toString()).toNumber() + 1);
      await expectRevert(
          upgraded.connect(this.alice).linearClaimPendingWithdraw(0),
          "LinearStakingPool: not released yet"
      );
      await time.increaseTo(duration.days(5).add(delta.toString()).toNumber() + 1);
      await instance.connect(this.alice).linearClaimPendingWithdraw(0);
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));
    });
  });
});
