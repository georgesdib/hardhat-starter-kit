import {
  getNetworkMember,
  autoFundCheck,
  developmentChains,
} from "../../helper-hardhat-config";
const skip = require("mocha-skip-if");
import chai from "chai";
import { expect } from "chai";
const BN = require("bn.js");
import bignumber from "chai-bn";
chai.use(bignumber(BN));

import { deployments, network, ethers, getChainId } from "hardhat";
const hre = require("hardhat");

skip
  .if(!developmentChains.includes(network.name))
  .describe("RandomNumberConsumer Unit Tests", async function () {
    let randomNumberConsumer: any;

    beforeEach(async () => {
      const chainId = await getChainId();
      await deployments.fixture(["mocks", "vrf"]);
      const LinkToken = await deployments.get("LinkToken");
      const linkToken = await ethers.getContractAt("LinkToken", LinkToken.address);
      const networkName = await getNetworkMember(chainId, "name");

      const linkTokenAddress = linkToken.address;
      const additionalMessage = " --linkaddress " + linkTokenAddress;

      const RandomNumberConsumer = await deployments.get(
        "RandomNumberConsumer"
      );
      randomNumberConsumer = await ethers.getContractAt(
        "RandomNumberConsumer",
        RandomNumberConsumer.address
      );

      if (
        await autoFundCheck(
          randomNumberConsumer.address,
          networkName,
          linkTokenAddress,
          additionalMessage,
          hre
        )
      ) {
        await hre.run("fund-link", {
          contract: randomNumberConsumer.address,
          linkaddress: linkTokenAddress,
        });
      }
    });

    it("Should successfully make an external random number request", async () => {
      const transaction = await randomNumberConsumer.getRandomNumber();
      const tx_receipt = await transaction.wait(1);
      const requestId = tx_receipt.events[2].topics[1];

      console.log("requestId: ", requestId);
      expect(requestId).to.not.be.null;
    });
  });
