const { expect, use } = require("chai");
const { fromUtf8 } = require("@iov/encoding");
const { Contract, getAccountByName, polarChai } = require("secret-polar");

use(polarChai);

describe("snip-20", () => {

  async function setup() {
    const contract_owner = getAccountByName("account_1");
    const other = getAccountByName("account_0");
    const other_2 = getAccountByName("account_2");
    const contract = new Contract("snip-20");
    await contract.parseSchema();

    return { contract_owner, other, other_2, contract };
  }

  it("mint", async () => {
    const { contract_owner, other, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);

    const contract_info = await contract.instantiate(
      {
        "decimals": 6,
        "name": "SampleSnip",
        "prng_seed": "YWE",
        "symbol": "SMPL",
        "config": { "enable_mint": true }
      },
      "deploy test",
      contract_owner
    );

    const mint_response = await contract.tx.mint(
      { account: contract_owner },
      {
        recipient: contract_owner.account.address,
        amount: "5000000"
      }
    );

    const viewing_key_data0 = await contract.tx.create_viewing_key(
      { account: contract_owner },
      { entropy: "sdasahgtdhhahhs" }
    );
    let str0 = new TextDecoder().decode(viewing_key_data0.data);
    let viewing_key0 = JSON.parse(str0).create_viewing_key.key;

    await expect(contract.query.balance({ "address": contract_owner.account.address, "key": viewing_key0 }, contract_owner)).to.respondWith({ 'balance': { 'amount': '5000000' } });
  });

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

  it("Transfer", async () => {
    const { contract_owner, other, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);

    const contract_info = await contract.instantiate(
      {
        "decimals": 6,
        "name": "SampleSnip",
        "prng_seed": "YWE",
        "symbol": "SMPL",
        "initial_balances": [{
          "address": contract_owner.account.address,
          "amount": "100000000"
        }]
      },
      "deploy test",
      contract_owner
    );

    let transfer_response = await contract.tx.transfer(
      { account: contract_owner },
      {
        recipient: other.account.address,
        amount: "50000000"
      }
    );

    const viewing_key_data0 = await contract.tx.create_viewing_key(
      { account: contract_owner },
      { entropy: "sdasadhhahhs" }
    );
    let str0 = new TextDecoder().decode(viewing_key_data0.data);
    let viewing_key0 = JSON.parse(str0).create_viewing_key.key;

    const viewing_key_data1 = await contract.tx.create_viewing_key(
      { account: other },
      { entropy: "sdasadhhahllkdkhs" }
    );
    let str1 = new TextDecoder().decode(viewing_key_data1.data);
    let viewing_key1 = JSON.parse(str1).create_viewing_key.key;
    await expect(contract.query.balance({ "address": contract_owner.account.address, "key": viewing_key0 }, contract_owner)).to.respondWith({ 'balance': { 'amount': '50000000' } });
    await expect(contract.query.balance({ "address": other.account.address, "key": viewing_key1 }, contract_owner)).to.respondWith({ 'balance': { 'amount': '50000000' } });
  });

  it("TransferFrom", async () => {
    const { contract_owner, other, other_2, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);

    const contract_info = await contract.instantiate(
      {
        "decimals": 6,
        "name": "SampleSnip",
        "prng_seed": "YWE",
        "symbol": "SMPL",
        "initial_balances": [{
          "address": contract_owner.account.address,
          "amount": "100000000"
        }]
      },
      "deploy test",
      contract_owner
    );
    const transfer_res = await contract.tx.transfer(
      { account: contract_owner },
      {
        recipient: other.account.address,
        amount: "50000000"
      }
    );

    const inc_allowance_res = await contract.tx.increase_allowance(
      { account: other },
      {
        spender: contract_owner.account.address,
        amount: "1000000"
      }
    );

    let transferFrom_response = await contract.tx.transfer_from(
      { account: contract_owner },
      {
        owner: other.account.address,
        recipient: other_2.account.address,
        amount: "500000"
      }
    );

    const viewing_key_data0 = await contract.tx.create_viewing_key(
      { account: other },
      { entropy: "sdasadhhahhs" }
    );
    let str0 = new TextDecoder().decode(viewing_key_data0.data);
    let viewing_key0 = JSON.parse(str0).create_viewing_key.key;
    const viewing_key_data1 = await contract.tx.create_viewing_key(
      { account: other_2 },
      { entropy: "sdasadhhahllkdkhs" }
    );
    let str1 = new TextDecoder().decode(viewing_key_data1.data);
    let viewing_key1 = JSON.parse(str1).create_viewing_key.key;

    await expect(contract.query.balance({ "address": other.account.address, "key": viewing_key0 }, contract_owner)).to.respondWith({ 'balance': { 'amount': '49500000' } });
    await expect(contract.query.balance({ "address": other_2.account.address, "key": viewing_key1 }, contract_owner)).to.respondWith({ 'balance': { 'amount': '500000' } });
  })
});
