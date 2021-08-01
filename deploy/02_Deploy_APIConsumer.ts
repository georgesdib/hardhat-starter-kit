import { getNetworkMember } from "../helper-hardhat-config";
import { ethers, deployments, getChainId } from "hardhat";

module.exports = async () => {
  const { deploy, log, get } = deployments;
  const [signer] = await ethers.getSigners();
  const deployer = signer.address;
  const chainId = await getChainId();

  let linkTokenAddress: string;
  let oracle: any, linkToken: any, MockOracle: any;
  //set log level to ignore non errors
  ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);

  if (chainId == "31337") {
    linkToken = await get("LinkToken");
    MockOracle = await get("MockOracle");
    linkTokenAddress = linkToken.address;
    oracle = MockOracle.address;
  } else {
    linkTokenAddress = await getNetworkMember(chainId, "linkToken");
    oracle = await getNetworkMember(chainId, "oracle");
  }
  const jobId = await getNetworkMember(chainId, "jobId");
  const fee = await getNetworkMember(chainId, "fee");
  const networkName = await getNetworkMember(chainId, "name");

  const apiConsumer = await deploy("APIConsumer", {
    from: deployer,
    args: [oracle, jobId, fee, linkTokenAddress],
    log: true,
  });

  log("Run API Consumer contract with following command:");
  log(
    "npx hardhat request-data --contract " +
      apiConsumer.address +
      " --network " +
      networkName
  );
  log("----------------------------------------------------");
};
module.exports.tags = ["all", "api", "main"];
