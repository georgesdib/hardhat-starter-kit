import { getNetworkMember } from "../helper-hardhat-config";
import { ethers, deployments, getChainId } from "hardhat";

module.exports = async () => {

  const { deploy, log, get } = deployments;
  const [signer] = await ethers.getSigners();
  const deployer = signer.address;
  const chainId = await getChainId();

  let linkTokenAddress: string, vrfCoordinatorAddress: string;
  let additionalMessage = "";
  let linkToken: any, VRFCoordinatorMock: any;

  if (chainId == "31337") {
    linkToken = await get('LinkToken');
    VRFCoordinatorMock = await get('VRFCoordinatorMock');
    linkTokenAddress = linkToken.address;
    vrfCoordinatorAddress = VRFCoordinatorMock.address;
    additionalMessage = " --linkaddress " + linkTokenAddress;
  } else {
    linkTokenAddress = await getNetworkMember(chainId, 'linkToken');
    vrfCoordinatorAddress = await getNetworkMember(chainId, 'vrfCoordinator');
  }
  const keyHash = await getNetworkMember(chainId, 'keyHash');
  const fee = await getNetworkMember(chainId, 'fee');

  const randomNumberConsumer = await deploy('RandomNumberConsumer', {
    from: deployer,
    args: [vrfCoordinatorAddress, linkTokenAddress, keyHash, fee],
    log: true
  });

  log("Run the following command to fund contract with LINK:");
  log("npx hardhat fund-link --contract " + randomNumberConsumer.address + " --network " + await getNetworkMember(chainId, 'name') + additionalMessage);
  log("Then run RandomNumberConsumer contract with the following command");
  log("npx hardhat request-random-number --contract " + randomNumberConsumer.address + " --network " + await getNetworkMember(chainId, 'name'));
  log("----------------------------------------------------");
}

module.exports.tags = ['all', 'vrf']