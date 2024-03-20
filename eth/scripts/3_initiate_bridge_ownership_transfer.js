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

async function createOwnershipAcceptanceTransaction(mostAddress, safeInstance) {
  const iface = await new ethers.Interface(["function acceptOwnership()"]);

  const transactions = [
    {
      to: mostAddress,
      data: iface.encodeFunctionData("acceptOwnership", []),
      value: 0,
    },
  ];

  console.log("creating a Safe transaction:", transactions);

  const safeTx = await safeInstance.createTransaction({
    transactions,
  });
  const safeTxHash = await safeInstance.getTransactionHash(safeTx);

  console.log("safeTxHash", safeTxHash);

  return safeTxHash;
}

async function main() {
  const signers = await ethers.getSigners();
  accounts = signers.map((s) => s.address);

  console.log("Using ", accounts[0], "as signer");

  // read addresses
  let addresses = JSON.parse(
    fs.readFileSync("addresses.json", { encoding: "utf8", flag: "r" }),
  );

  const Migrations = artifacts.require("Migrations");
  const migrations = await Migrations.at(addresses.migrations);

  // check migratons
  let lastCompletedMigration = await migrations.last_completed_migration();
  lastCompletedMigration = lastCompletedMigration.toNumber();
  console.log("Last completed migration: ", lastCompletedMigration);
  if (lastCompletedMigration != 2) {
    console.error("Previous migration has not been completed");
    process.exit(-1);
  }

  // --- setup

  const Most = artifacts.require("Most");
  const most = await Most.at(addresses.most);

  if (network.name == "development" || network.name == "bridgenet") {
    // NOTE : TEMPorary before devnet is fixed and uses propere genesis that seeds these accounts with funds
    for (const to of signers.slice(1, 4)) {
      await signers[0].sendTransaction({
        to: to.address,
        value: ethers.parseEther("1.0"), // Send 1.0 ether
      });
    }

    await most.transferOwnership(addresses.gnosis.safe);

    const safeSdk0 = await createSafeInstance(signers[1], addresses);
    const safeTxHash = await createOwnershipAcceptanceTransaction(most.address, safeSdk0);

    fs.writeFileSync("acceptOwnershipTxHash.json", JSON.stringify(safeTxHash));
  }

  // -- update migrations
  console.log("Updating migrations...");
  await migrations.setCompleted(3);

  console.log("Done");
  // NOTE: neccessary because script hangs in CI
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
