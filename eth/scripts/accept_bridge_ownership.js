const fs = require("node:fs");
const { ethers, artifacts, network } = require("hardhat");
const { Keyring } = require("@polkadot/keyring");
const { u8aToHex } = require("@polkadot/util");
const Safe = require("@safe-global/protocol-kit").default;
const { EthersAdapter } = require("@safe-global/protocol-kit");

// const contracts = require("../addresses.json");
const azeroContracts = require("../../azero/addresses.json");

async function createSafeInstance(signer, contracts) {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });
  const chainId = await ethAdapter.getChainId();
  const contractNetworks = {
    [chainId]: {
      safeSingletonAddress: contracts.gnosis.safeSingletonAddress,
      safeProxyFactoryAddress: contracts.gnosis.safeProxyFactoryAddress,
      multiSendAddress: contracts.gnosis.multiSendAddress,
      multiSendCallOnlyAddress: contracts.gnosis.multiSendCallOnlyAddress,
      fallbackHandlerAddress: contracts.gnosis.fallbackHandlerAddress,
      signMessageLibAddress: contracts.gnosis.signMessageLibAddress,
      createCallAddress: contracts.gnosis.createCallAddress,
      simulateTxAccessorAddress: contracts.gnosis.simulateTxAccessorAddress,
    },
  };

  return await Safe.create({
    ethAdapter: ethAdapter,
    safeAddress: contracts.gnosis.safe,
    contractNetworks,
  });
}

// signing with on-chain signatures
async function signSafeTransaction(safeInstance, txHash) {
  const approveTxResponse = await safeInstance.approveTransactionHash(txHash);
  await approveTxResponse.transactionResponse?.wait();
}

async function executeSafeTransaction(safeInstance, safeTransaction) {
  const executeTxResponse =
    await safeInstance.executeTransaction(safeTransaction);
  await executeTxResponse.transactionResponse?.wait();
}

async function main() {
  const provider = new ethers.JsonRpcProvider(network.config.url);
  const guardian_signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  const account = guardian_signer.address;
  const signers = await ethers.getSigners();

  console.log("Using ", account, "as signer");

  // read addresses
  let addresses = JSON.parse(
    fs.readFileSync("addresses.json", { encoding: "utf8", flag: "r" }),
  );

  if (network.name == "development" || network.name == "bridgenet") {
    // NOTE : TEMPorary before devnet is fixed and uses propere genesis that seeds these accounts with funds
    await signers[0].sendTransaction({
      to: account,
      value: ethers.parseEther("1.0"), // Send 1.0 ether
    });

    let safeTxHash = JSON.parse(
        fs.readFileSync("acceptOwnershipTxHash.json", { encoding: "utf8", flag: "r" }),
    );

    const safeSdk = await createSafeInstance(guardian_signer, addresses);

    //const approvals_pre_signing = (await safeSdk.getOwnersWhoApprovedTx(safeTxHash)).length;
    await signSafeTransaction(safeSdk, safeTxHash);
    //if (approvals_pre_signing == (network.config.deploymentConfig.threshold - 1)) {
    //  await executeSafeTransaction(safeSdk, safeTransaction);
    //}
  }

  console.log("Done");
  // NOTE: neccessary because script hangs in CI
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
