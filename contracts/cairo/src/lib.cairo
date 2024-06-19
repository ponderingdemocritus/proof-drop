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

    use openzeppelin::token::erc20::interface::{IERC20, IERC20Dispatcher, IERC20DispatcherTrait};


    const AIRDROP_AMOUNT: u256 = 420000000000000000000;

    #[storage]
    struct Storage {
        herodotus_facts_registry: ContractAddress,
        claimed: LegacyMap::<u256, bool>,
        lords: ContractAddress
    }


    #[constructor]
    fn constructor(ref self: ContractState, lordsContract: ContractAddress) {
        self
            .herodotus_facts_registry
            .write(
                0x01b2111317EB693c3EE46633edd45A4876db14A3a53ACDBf4E5166976d8e869d
                    .try_into()
                    .unwrap()
            );

        self.lords.write(lordsContract);
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

            // 1. get mapped address and check
            // TODO: this should be wrapped into a Cairo Component
            let claimer = IEvmFactsRegistryDispatcher {
                contract_address: self.herodotus_facts_registry.read()
            }
                .get_slot_value(account, block, claimer_slot)
                .unwrap();
            let caller_felt: felt252 = caller.into();
            assert(caller_felt.into() == claimer, 'You are not the owner!');

            // 2. check ownership
            let ownership: u256 = IEvmFactsRegistryDispatcher {
                contract_address: self.herodotus_facts_registry.read()
            }
                .get_slot_value(account, block, ownership_slot)
                .unwrap();

            assert(ownership == claimer, 'You dont own the NFT!');
            // TODO: do some more stuff

            // 3. mark as claimed
            self.claimed.write(claimer_slot, true);

            // send erc20
            IERC20Dispatcher { contract_address: self.lords.read() }
                .transfer(caller, AIRDROP_AMOUNT);
        }
    }
}
