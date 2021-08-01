import { expect } from "chai";
import chai from "chai";
const BN = require("bn.js");
const skip = require("mocha-skip-if");
import bignumber from "chai-bn";
chai.use(bignumber(BN));
import { deployments, network, ethers, web3 } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";

skip
  .if(!developmentChains.includes(network.name))
  .describe("PriceConsumer Unit Tests", async function () {
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    let priceConsumerV3: any;

    beforeEach(async () => {
      await deployments.fixture(["mocks", "feed"]);
      const PriceConsumerV3 = await deployments.get("PriceConsumerV3");
      priceConsumerV3 = await ethers.getContractAt(
        "PriceConsumerV3",
        PriceConsumerV3.address
      );
    });

    it("should return a positive value", async () => {
      let result = await priceConsumerV3.getLatestPrice();
      console.log(
        "Price Feed Value: ",
        new BN(result._hex).toString()
      );
      expect(
        new BN(result._hex).toString()
      ).to.be.a.bignumber.that.is.greaterThan(new BN(0));
    });
  });
