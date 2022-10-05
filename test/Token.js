const { ethers } = require("hardhat");
const { expect } = require("chai");
const { toBeInvalid } = require("@testing-library/jest-dom/dist/matchers");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  let token, deployer, accounts, receiver, exchange;
  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Dapp University", "DAPP", "1000000");

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
    exchange = accounts[2];
  });

  describe("Deployment", () => {
    const name = "Dapp University";
    const symbol = "DAPP";
    const decimals = "18";
    const totalSupply = tokens(1000000);
    it("has correct name", async () => {
      expect(await token.name()).to.equal(name);
    });

    it("has correct decimals", async () => {
      expect(await token.decimals()).to.equal(decimals);
    });

    it("has correct totalSupply", async () => {
      expect(await token.totalSupply()).to.equal(totalSupply);
    });

    it("has correct symbol", async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it("assigns totalsupply to deployer", async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });

    it("assigns owner to deployer", async () => {});
  });

  describe.only("Sending free tokens", () => {
    let amount = tokens(500);
    let transaction, result;
    describe("Success", () => {
      beforeEach(async () => {
        transaction = await token.connect(receiver).getFreeTokens();
        result = await transaction.wait();
      });

      it("transfers 500 tokens to receiver", async () => {
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });
    });

    describe("Failure", () => {
      beforeEach(async () => {
        transaction = await token.connect(receiver).getFreeTokens();
        result = await transaction.wait();
      });
      it("receiver already has 500 tokens", async () => {
        await expect(
          token.connect(receiver).getFreeTokens()
        ).to.be.reverted;
      });
    });
  });

  describe("Sending Tokens", () => {
    let amount, transaction, result;

    describe("success", () => {
      beforeEach(async () => {
        amount = tokens(100);
        transaction = await token
          .connect(deployer)
          .transfer(receiver.address, amount);
        result = await transaction.wait();
      });
      it("transfers token balance", async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(
          tokens(999900)
        );
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it("emits a transfer event", async () => {
        const event = result.events[0];
        expect(event.event).to.equal("Transfer");

        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("rejects insufficient balances", async () => {
        const invalidAmount = tokens(100000000);
        await expect(
          token.connect(deployer).transfer(receiver.address, invalidAmount)
        ).to.be.reverted;
      });

      it("rejects invalid recipient", async () => {
        await expect(
          token
            .connect(deployer)
            .transfer("0x0000000000000000000000000000000000000000", amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Approving tokens", () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token
        .connect(deployer)
        .approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe("Success", () => {
      it("allocates an allowance for delgated token spending", async () => {
        expect(
          await token.allowance(deployer.address, exchange.address)
        ).to.equal(amount);
      });

      it("emits a approval event", async () => {
        const event = result.events[0];
        expect(event.event).to.equal("Approval");

        const args = event.args;
        expect(args.owner).to.equal(deployer.address);
        expect(args.spender).to.equal(exchange.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("rejects invalid spender", async () => {
        await expect(
          token
            .connect(deployer)
            .approve("0x0000000000000000000000000000000000000000", amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Delegated token transfers", () => {
    let amount, transaction, result;
    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token
        .connect(deployer)
        .approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe("Success", () => {
      beforeEach(async () => {
        transaction = await token
          .connect(exchange)
          .transferFrom(deployer.address, receiver.address, amount);
        result = await transaction.wait();
      });

      it("transfers token balance", async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(
          tokens(999900)
        );
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it("resets the allowance", async () => {
        expect(
          await token.allowance(deployer.address, exchange.address)
        ).to.equal(tokens(0));
      });

      it("emits a transfer event", async () => {
        const event = result.events[0];
        expect(event.event).to.equal("Transfer");

        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure", async () => {
      const invalidAmount = tokens(100000000);
      await expect(
        token
          .connect(exchange)
          .transferFrom(deployer.address, receiver.address, invalidAmount)
      ).to.be.reverted;
    });
  });
});
