// Copyright 2017-2021 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { selectableNetworks } from '@polkadot/networks';
import { assert, BN, hexToU8a, stringify } from '@polkadot/util';
import kusama from "./kusama.js";
import polkadot from "./polkadot.js";
import westend from "./westend.js";
const allKnown = {
  kusama,
  polkadot,
  westend
}; // testnets are not available in the networks map

const NET_EXTRA = {
  westend: {
    genesisHash: ['0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e']
  }
};
/** @internal */

function checkOrder(network, versions) {
  const ooo = versions.filter((curr, index) => {
    const prev = versions[index - 1];
    return index === 0 ? false : curr[0] <= prev[0] || curr[1] <= prev[1];
  });
  assert(!ooo.length, () => `${network}: Mismatched upgrade ordering: ${stringify(ooo)}`);
  return versions;
}
/** @internal */


function mapRaw([network, versions]) {
  const chain = selectableNetworks.find(n => n.network === network) || NET_EXTRA[network];
  assert(chain, () => `Unable to find info for chain ${network}`);
  return {
    genesisHash: hexToU8a(chain.genesisHash[0]),
    network,
    versions: checkOrder(network, versions).map(([blockNumber, specVersion]) => ({
      blockNumber: new BN(blockNumber),
      specVersion: new BN(specVersion)
    }))
  };
} // Type overrides for specific spec types & versions as given in runtimeVersion


const upgrades = Object.entries(allKnown).map(mapRaw);
export default upgrades;