#[starknet::interface]
trait IEvmFactsRegistry<TContractState> {
    fn get_slot_value(
        self: @TContractState, account: felt252, block: u256, slot: u256
    ) -> Option<u256>;
}

#[starknet::interface]
trait IProofClaimContract<TContractState> {
    fn claim(
        ref self: TContractState,
        account: felt252,
        block: u256,
        ownership_slot: u256,
        claimer_slot: u256
    );
}

#[starknet::contract]
mod ProofClaimContract {
    use core::traits::TryInto;
    use core::traits::Into;
    use core::option::OptionTrait;
    use starknet::ContractAddress;
    use super::{IEvmFactsRegistryDispatcherTrait, IEvmFactsRegistryDispatcher};

    const AIRDROP_ELIGIBILITY_THRESHOLD: u256 = 1;

    #[storage]
    struct Storage {
        herodotus_facts_registry: ContractAddress
    }


    #[constructor]
    fn constructor(ref self: ContractState) {
        self
            .herodotus_facts_registry
            .write(
                0x01b2111317EB693c3EE46633edd45A4876db14A3a53ACDBf4E5166976d8e869d
                    .try_into()
                    .unwrap()
            );
    }

    #[abi(embed_v0)]
    impl ProofClaimContract of super::IProofClaimContract<ContractState> {
        fn claim(
            ref self: ContractState,
            account: felt252,
            block: u256,
            ownership_slot: u256,
            claimer_slot: u256
        ) {
            let caller = starknet::get_caller_address();

            // 1. Check the L1 NFT ownership
            let ownership_amount: u256 = IEvmFactsRegistryDispatcher {
                contract_address: self.herodotus_facts_registry.read()
            }
                .get_slot_value(account, block, ownership_slot)
                .unwrap();

            assert(ownership_amount >= AIRDROP_ELIGIBILITY_THRESHOLD, 'You dont own the NFT!');

            // 2. Check the address registry mapping on ProofDropCore
            let claimer = IEvmFactsRegistryDispatcher {
                contract_address: self.herodotus_facts_registry.read()
            }
                .get_slot_value(account, block, claimer_slot)
                .unwrap();
            let caller_felt: felt252 = caller.into();
            assert(caller_felt.into() == claimer, 'You are not the owner!');
        // TODO: do some more stuff
        }
    }
}
