const { expect, use } = require("chai");
const { Contract, getAccountByName, polarChai } = require("secret-polar");

use(polarChai);

describe("snip-20", () => {
  async function setup() {
    const contract_owner = getAccountByName("account_1");
    const other = getAccountByName("account_0");
    const contract = new Contract("snip-20");
    await contract.parseSchema();

    return { contract_owner, other, contract };
  }

  it("deploy and init", async () => {
    const { contract_owner, other, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);

    const contract_info = await contract.instantiate(
      {
        "decimals": 6,
        "name": "SampleSnip",
        "prng_seed": "YWE",
        "symbol": "SMPL"
      },
      "deploy test",
      contract_owner
    );

    await expect(contract.query.token_info()).to.respondWith(
      {
        token_info: {
          name: 'SampleSnip',
          symbol: 'SMPL',
          decimals: 6,
          total_supply: null
        }
      }
    );
  });

  it("mint", async () => {
    const { contract_owner, other, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);

    const contract_info = await contract.instantiate(
      {
        "decimals": 6,
        "name": "SampleSnip",
        "prng_seed": "YWE",
        "symbol": "SMPL"
      },
      "deploy test",
      contract_owner
    );

    const mint_response = await contract.tx.mint(
      {account: contract_owner},
      5000000,
      contract_owner.account.address
    );
    console.log(mint_response);
  });
});
