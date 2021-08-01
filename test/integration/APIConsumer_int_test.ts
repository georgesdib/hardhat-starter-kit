import chai from "chai";
import { expect } from "chai";
const BN = require("bn.js");
import bignumber from "chai-bn";
chai.use(bignumber(BN));
const skip = require("mocha-skip-if");
import { developmentChains } from "../../helper-hardhat-config";
import { deployments, network, ethers } from "hardhat";

skip
  .if(developmentChains.includes(network.name))
  .describe("APIConsumer Integration Tests", async function () {
    let apiConsumer: any;

    beforeEach(async () => {
      const APIConsumer = await deployments.get("APIConsumer");
      apiConsumer = await ethers.getContractAt(
        "APIConsumer",
        APIConsumer.address
      );
    });

    it("Should successfully make an external API request and get a result", async () => {
      const transaction = await apiConsumer.requestVolumeData();
      const tx_receipt = await transaction.wait();
      const requestId = tx_receipt.events[0].topics[1];

      //wait 30 secs for oracle to callback
      await new Promise((resolve) => setTimeout(resolve, 30000));

      //Now check the result
      const result = await apiConsumer.volume();
      console.log("API Consumer Volume: ", new BN(result._hex).toString());
      expect(new BN(result._hex)).to.be.a.bignumber.that.is.greaterThan(
        new BN(0)
      );
    });
  });
