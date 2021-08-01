import { task } from "hardhat/config";

// This script only works with --network 'mainnet', or 'hardhat' when running a fork of mainnet
task("read-price-feed-ens", "Gets the latest price from a Chainlink Price Feed")
  .addParam("pair", "The token pair that you want to read, ie 'btc-usd'")
  .setAction(async (taskArgs, hre) => {
    const ensAddress = taskArgs.pair + ".data.eth";
    console.log(ensAddress);

    const V3Aggregator = await hre.ethers.getContractFactory(
      "MockV3Aggregator"
    );
    console.log("Reading data from Price Feed consumer contract ", ensAddress);

    //Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    const priceFeedConsumerContract = await new hre.ethers.Contract(
      ensAddress,
      V3Aggregator.interface,
      signer
    );
    await priceFeedConsumerContract.latestRoundData().then((data: any) => {
      console.log("Price is: ", BigInt(data["answer"]).toString());
    });
  });
