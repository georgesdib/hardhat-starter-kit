import { task } from "hardhat/config";

task("read-price-feed", "Gets the latest price from a Chainlink Price Feed")
  .addParam(
    "contract",
    "The address of the Price Feed consumer contract that you want to read"
  )
  .setAction(async (taskArgs, hre) => {
    const contractAddr = taskArgs.contract;
    const networkId = hre.network.name;

    const PriceFeedConsumerContract = await hre.ethers.getContractFactory(
      "PriceConsumerV3"
    );
    console.log(
      "Reading data from Price Feed consumer contract ",
      contractAddr,
      " on network ",
      networkId
    );

    //Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    const priceFeedConsumerContract = await new hre.ethers.Contract(
      contractAddr,
      PriceFeedConsumerContract.interface,
      signer
    );
    await priceFeedConsumerContract.getLatestPrice().then((data: any) => {
      console.log("Price is: ", BigInt(data).toString());
    });
  });
