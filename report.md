# **Aleph Zero: Most Relayer Audit Competition on Hats.finance** 


## Introduction to Hats.finance


Hats.finance builds autonomous security infrastructure for integration with major DeFi protocols to secure users' assets. 
It aims to be the decentralized choice for Web3 security, offering proactive security mechanisms like decentralized audit competitions and bug bounties. 
The protocol facilitates audit competitions to quickly secure smart contracts by having auditors compete, thereby reducing auditing costs and accelerating submissions. 
This aligns with their mission of fostering a robust, secure, and scalable Web3 ecosystem through decentralized security solutions​.

## About Hats Audit Competition


Hats Audit Competitions offer a unique and decentralized approach to enhancing the security of web3 projects. Leveraging the large collective expertise of hundreds of skilled auditors, these competitions foster a proactive bug hunting environment to fortify projects before their launch. Unlike traditional security assessments, Hats Audit Competitions operate on a time-based and results-driven model, ensuring that only successful auditors are rewarded for their contributions. This pay-for-results ethos not only allocates budgets more efficiently by paying exclusively for identified vulnerabilities but also retains funds if no issues are discovered. With a streamlined evaluation process, Hats prioritizes quality over quantity by rewarding the first submitter of a vulnerability, thus eliminating duplicate efforts and attracting top talent in web3 auditing. The process embodies Hats Finance's commitment to reducing fees, maintaining project control, and promoting high-quality security assessments, setting a new standard for decentralized security in the web3 space​​.

## Aleph Zero: Most Relayer Overview

Most is a token bridge to be deployed between Ethereum and Aleph Zero.

## Competition Details


- Type: A public audit competition hosted by Aleph Zero: Most Relayer
- Duration: 14 days
- Maximum Reward: $40,000
- Submissions: 10
- Total Payout: $2,500 distributed among 2 participants.

## Scope of Audit

## Project overview
Off-chain component of the MOST guardian bridge written in Rust. Bridge is designed to bridge ERC20 tokens from Ethereum to Aleph Zero network.
## Audit competition scope

```
|-- most
     |-- relayer
          |-- relayer
          |-- signer
          |-- signer_client
```

## Minor severity issues


- **Update Ethereum block production time to 12 seconds for Proof of Stake**

  The Ethereum block time was previously set to 15 seconds, reflecting the Proof of Work system. After transitioning to Proof of Stake in September 2023, the actual block production time has decreased to 12 seconds. This discrepancy affects state updates and sleep durations. It is recommended to update the block time to 12 seconds in the code.


  **Link**: [Issue #2](https://github.com/hats-finance/Aleph-Zero--Most-Relayer-0xd51be7e53f99f5f0153e1a3c154736adfd4c65e9/issues/2)


- **Relayer May Send Duplicate Transactions in azero.handle_event, Increasing Gas Usage**

  A transaction might be sent multiple times by the same relayer in `azero.handle_event`, leading to unnecessary gas consumption. This happens due to a pending transaction in the mempool causing the function to loop and resend the transaction. Various steps to counteract this issue include increasing confirmation times, extending poll intervals, and implementing defensive handling.


  **Link**: [Issue #7](https://github.com/hats-finance/Aleph-Zero--Most-Relayer-0xd51be7e53f99f5f0153e1a3c154736adfd4c65e9/issues/7)



## Conclusion

The Aleph Zero: Most Relayer audit competition, facilitated by Hats.finance, exemplifies a cost-effective and innovative decentralized security approach through collaborative auditing. The competition focused on the security of a token bridge between Ethereum and Aleph Zero, emphasizing the importance of thorough audits for web3 projects. Conducted over 14 days, the competition attracted 10 submissions but resulted in a total payout of $2,500 distributed among two participants, against a maximum potential reward of $40,000. Critical audit elements included ensuring the bridge’s off-chain components in Rust adequately secured ERC20 token transfers. Minor issues identified included updating Ethereum's block production time to reflect its transition to Proof of Stake and mitigating duplicate transactions in the relayer to optimize gas usage. This process underscores Hats.finance's commitment to efficient, effective security assessments by leveraging a competitive decentralized model, thereby setting a high standard for web3 security.

## Disclaimer


This report does not assert that the audited contracts are completely secure. Continuous review and comprehensive testing are advised before deploying critical smart contracts.


The Aleph Zero: Most Relayer audit competition illustrates the collaborative effort in identifying and rectifying potential vulnerabilities, enhancing the overall security and functionality of the platform.


Hats.finance does not provide any guarantee or warranty regarding the security of this project. Smart contract software should be used at the sole risk and responsibility of users.

