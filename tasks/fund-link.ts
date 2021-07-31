import { task } from "hardhat/config";
import { networkConfig, getNetworkIdFromName, getNetworkMember } from '../helper-hardhat-config';

task("fund-link", "Funds a contract with LINK")
    .addParam("contract", "The address of the contract that requires LINK")
    .addOptionalParam("linkaddress", "Set the LINK token address")
    .setAction(async (taskArgs, hre) => {
        const contractAddr = taskArgs.contract;
        let networkId = await getNetworkIdFromName(hre.network.name);

        //Fund with LINK based on network config
        const fundAmount = await getNetworkMember(networkId, 'fundAmount');

        console.log("Funding contract " + contractAddr + " on network " + hre.network.name);
        let linkTokenAddress = await getNetworkMember(networkId, 'linkToken') || taskArgs.linkaddress;
        const LinkToken = await hre.ethers.getContractFactory("LinkToken")

        //Get signer information
        const accounts = await hre.ethers.getSigners()
        const signer = accounts[0]

        //Create connection to LINK token contract and initiate the transfer
        const linkTokenContract = new hre.ethers.Contract(linkTokenAddress, LinkToken.interface, signer)
        var transferTransaction = await linkTokenContract.transfer(contractAddr, fundAmount)
        transferTransaction.wait(1)
        console.log('Contract ' + contractAddr + ' funded with ' + fundAmount / Math.pow(10, 18) + ' LINK. Transaction Hash: ' + transferTransaction.hash)

    })
