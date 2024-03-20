use std::str::FromStr;

use aleph_client::{contract::ContractInstance, keypair_from_string, sp_runtime::AccountId32};
use ethers::{
    middleware::Middleware,
    signers::{coins_bip39::English, MnemonicBuilder, Signer},
    utils,
};
use log::info;

use crate::{azero, config::setup_test, eth, wait::wait_for_balance_change};

#[tokio::test]
pub async fn multisig() -> anyhow::Result<()> {
    let config = setup_test();

    let azero_contract_addresses =
        azero::contract_addresses(&config.azero_contract_addresses_path)?;
    let most_address = AccountId32::from_str(&azero_contract_addresses.most)
        .map_err(|e| anyhow::anyhow!("Cannot parse account id from string: {:?}", e))?;
    let weth_azero_address = AccountId32::from_str(&azero_contract_addresses.weth)
        .map_err(|e| anyhow::anyhow!("Cannot parse account id from string: {:?}", e))?;

    let weth_azero = ContractInstance::new(
        weth_azero_address.clone(),
        &config.contract_metadata_paths.azero_token,
    )?;

    let azero_account_keypair = keypair_from_string(&config.azero_account_seed);
    let azero_signed_connection =
        azero::signed_connection(&config.azero_node_ws, &azero_account_keypair).await;

    let most = ContractInstance::new(most_address, &config.contract_metadata_paths.azero_most)?;

    let transfer_ownership_info = most
        .contract_exec(
            &azero_signed_connection,
            "Ownable2Step::transfer_ownership",
            &["5DjYJStmdZ2rcqXbXGX7TW85JsrW6uG4y9MUcLq2BoPMpRA7"],
        )
        .await?;
    info!("`transfer_ownership` tx info: {:?}", transfer_ownership_info);

    Ok(())
}
