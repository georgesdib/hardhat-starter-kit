import { task } from "hardhat/config";
import { getNetworkMember, getNetworkIdFromName } from '../helper-hardhat-config';

task("withdraw-link", "Returns any LINK left in deployed contract")
    .addParam("contract", "The address of the contract")
    .addOptionalParam("linkaddress", "Set the LINK token address")
    .setAction(async (taskArgs, hre) => {
        const contractAddr = taskArgs.contract;
        const networkId = await getNetworkIdFromName(hre.network.name);

        //Get signer information
        const accounts = await hre.ethers.getSigners();
        const signer = accounts[0];

        //First, lets see if there is any LINK to withdraw
        const linkTokenAddress = await getNetworkMember(networkId, 'linkToken') || taskArgs.linkaddress;
        const LinkToken = await hre.ethers.getContractFactory("LinkToken");
        const linkTokenContract = new hre.ethers.Contract(linkTokenAddress, LinkToken.interface, signer);
        const balanceHex = await linkTokenContract.balanceOf(contractAddr);
        let balance = await hre.web3.utils.toBN(balanceHex._hex);
        balance = balance.div(hre.web3.utils.toBN(Math.pow(10, 18)));
        console.log('LINK balance of contract: ' + contractAddr + " is " + balance);

        if (!balance.isNeg()) {
            //Could also be Any-API contract, but in either case the function signature is the same, so we just need to use one
            const RandomNumberConsumer = await hre.ethers.getContractFactory("RandomNumberConsumer")

            //Create connection to Consumer Contract and call the withdraw function
            const ConsumerContract = new hre.ethers.Contract(contractAddr, RandomNumberConsumer.interface, signer)
            const result = await ConsumerContract.withdrawLink()
            console.log('All LINK withdrew from contract ' + contractAddr, '. Transaction Hash: ', result.hash)
        } else {
            console.log("Contract doesn't have any LINK to withdraw")
        }

    })
