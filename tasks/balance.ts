import { task } from "hardhat/config";
//import Web3 from "web3";

//let web3 = new Web3();

task("balance", "Prints an account's balance")
    .addParam("account", "The account's address")
    .setAction(async (taskArgs, hre) => {
        const account = hre.web3.utils.toChecksumAddress(taskArgs.account)
        const balance = await hre.web3.eth.getBalance(account)

        console.log(hre.web3.utils.fromWei(balance, "ether"), "ETH")
    })
