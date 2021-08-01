import chai from "chai";
import { expect } from "chai";
const skip = require("mocha-skip-if");
const BN = require("bn.js");
import bignumber from "chai-bn";
chai.use(bignumber(BN));
import { developmentChains } from "../../helper-hardhat-config";
import { deployments, network, ethers } from "hardhat";

skip
  .if(developmentChains.includes(network.name))
  .describe("RandomNumberConsumer Integration Tests", async function () {
    let randomNumberConsumer: any;

    beforeEach(async () => {
      const RandomNumberConsumer = await deployments.get(
        "RandomNumberConsumer"
      );
      randomNumberConsumer = await ethers.getContractAt(
        "RandomNumberConsumer",
        RandomNumberConsumer.address
      );
    });

    it("Should successfully make a VRF request and get a result", async () => {
      const transaction = await randomNumberConsumer.getRandomNumber();
      const tx_receipt = await transaction.wait();
      const requestId = tx_receipt.events[2].topics[1];

      //wait 30 secs for oracle to callback
      await new Promise((resolve) => setTimeout(resolve, 30000));

      const result = await randomNumberConsumer.randomResult();
      console.log("VRF Result: ", new BN(result._hex).toString());
      expect(new BN(result._hex)).to.be.a.bignumber.that.is.greaterThan(
        new BN(0)
      );
    });
  });
