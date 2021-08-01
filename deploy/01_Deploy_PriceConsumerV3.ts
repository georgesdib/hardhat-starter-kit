import { getNetworkMember } from "../helper-hardhat-config";
import { ethers, deployments, getChainId } from "hardhat";

module.exports = async () => {
  const { deploy, log } = deployments;
  const [signer] = await ethers.getSigners();
  const deployer = signer.address;
  const chainId = await getChainId();

  let ethUsdPriceFeedAddress: string;
  if (chainId == "31337") {
    const EthUsdAggregator = await deployments.get("EthUsdAggregator");
    ethUsdPriceFeedAddress = EthUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = await getNetworkMember(chainId, "ethUsdPriceFeed");
  }
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one below is ETH/USD contract on Kovan
  log("----------------------------------------------------");
  const priceConsumerV3 = await deploy("PriceConsumerV3", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  });
  log("Run Price Feed contract with command:");
  log(
    "npx hardhat read-price-feed --contract " +
      priceConsumerV3.address +
      " --network " +
      (await getNetworkMember(chainId, "name"))
  );
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "feed", "main"];
