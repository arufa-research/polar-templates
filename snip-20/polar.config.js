const accounts = [
  {
    name: 'account_0',
    address: 'secret1mg2um4yztjq098kt2fvg7uee0fzzsm3nh75pmm',
    mnemonic: 'plug pair three fox resemble cute pig glad rhythm solve puppy place tag improve render monitor coral survey proof snake enrich feature ticket young'
  },
  {
    name: 'account_1',
    address: 'secret19umsxyuxn8z5rqrl8y3q5fvde5tv0ghwyw4zcd',
    mnemonic: 'armed quarter cloud pepper quit example involve industry ritual ill walnut game pair basic imitate defense crystal harbor remember tag plug spread occur focus'
  },
  {
    name: 'account_2',
    address: 'secret1tjydzuends7ak30n4q5wjmt60v0c5j5r45m5nk',
    mnemonic: 'empower oyster animal erupt public benefit humor jacket coin asthma shadow author rigid payment shy damp ecology celery clay common verify wool dry fade'
  }
];

const networks = {
  localnet: {
    endpoint: 'http://localhost:1337/',
    accounts: accounts,
    fees: {
      upload: {
          amount: [{ amount: "5000000", denom: "uscrt" }],
          gas: "4000000",
      },
      init: {
          amount: [{ amount: "125000", denom: "uscrt" }],
          gas: "500000",
      },
    }
  },
  // Pulsar-2
  testnet: {
    endpoint: 'http://testnet.securesecrets.org:1317/',
    chainId: 'pulsar-2',
    trustNode: true,
    keyringBackend: 'test',
    accounts: accounts,
    fees: {
      upload: {
          amount: [{ amount: "5000000", denom: "uscrt" }],
          gas: "4000000",
      },
      init: {
          amount: [{ amount: "125000", denom: "uscrt" }],
          gas: "500000",
      },
    }
  },
  development: {
    endpoint: 'tcp://0.0.0.0:26656',
    nodeId: '115aa0a629f5d70dd1d464bc7e42799e00f4edae',
    chainId: 'enigma-pub-testnet-3',
    keyringBackend: 'test',
    types: {}
  },
  // Supernova Testnet
  supernova: {
    endpoint: 'http://bootstrap.supernova.enigma.co:1317',
    chainId: 'supernova-2',
    trustNode: true,
    keyringBackend: 'test',
    accounts: accounts,
    types: {},
    fees: {
      upload: {
          amount: [{ amount: "500000", denom: "uscrt" }],
          gas: "2000000",
      },
      init: {
          amount: [{ amount: "125000", denom: "uscrt" }],
          gas: "500000",
      },
    }
  }
};

module.exports = {
  networks: {
    default: networks.testnet,
    localnet: networks.localnet,
    development: networks.development
  },
  mocha: {
    timeout: 18000000
  },
  rust: {
    version: "nightly-2020-12-31",
  }
};