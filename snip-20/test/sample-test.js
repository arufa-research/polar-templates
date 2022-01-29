const { expect, use } = require("chai");
const { fromUtf8 } = require("@iov/encoding");
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

  // it("deploy and init", async () => {
  //   const { contract_owner, other, contract } = await setup();
  //   const deploy_response = await contract.deploy(contract_owner);

  //   const contract_info = await contract.instantiate(
  //     {
  //       "decimals": 6,
  //       "name": "SampleSnip",
  //       "prng_seed": "YWE",
  //       "symbol": "SMPL"
  //     },
  //     "deploy test",
  //     contract_owner
  //   );

  //   await expect(contract.query.token_info()).to.respondWith(
  //     {
  //       token_info: {
  //         name: 'SampleSnip',
  //         symbol: 'SMPL',
  //         decimals: 6,
  //         total_supply: null
  //       }
  //     }
  //   );
  // });
  // checking token transfer from total supply to a account {In this case we are transfering from total supply to contract owner account}
  it("Transfer",async () => {
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
          "amount": "1000000000"
      }]
      },
      "deploy test",
      contract_owner
    );
  const viewing_key_data = await contract.tx.create_viewing_key(
    {account: contract_owner},
    {entropy: "sdasads"}
  );
  let str = new TextDecoder().decode(viewing_key_data.data);
  // console.log(str);
  let viewing_key = JSON.parse(str).create_viewing_key.key;
  
  
  let transfer_response = await contract.tx.transfer(
    {amount:1000,
    recipient: account_owner.account.address},
    {account: contract_owner}
    );
  
  await expect(contract.query.balance({ "address": contract_owner.account.address, "key": viewing_key},contract_owner)).to.respondWith({'amount':1000001000});

  });
  // checking token transfer from one account to other 
  it("TransferFrom",async () => {
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
          "amount": "1000000000"
      }]
      },
      "deploy test",
      contract_owner
    );
    //transfering 1000 tokens from contract_owner account to other account
    let transferFrom_response = await contract.tx.transfer_from(
      {
        owner:contract_owner.account.address,
        recipient:other.account.address,
        amount:1000
      },
      {account:contract_owner}
    );
    // finding viewing key for contract owner
    const viewing_key_data0 = await contract.tx.create_viewing_key(
      {account: contract_owner},
      {entropy: "sdasadhhahhs"}
    );
    let str0 = new TextDecoder().decode(viewing_key_data0.data);
    // console.log(str);
    let viewing_key0= JSON.parse(str0).create_viewing_key.key;

    // finding viewing key for other account
    const viewing_key_data1 = await contract.tx.create_viewing_key(
      {account: other},
      {entropy: "sdasadhhahllkdkhs"}
    );
    let str1 = new TextDecoder().decode(viewing_key_data1.data);
    // console.log(str);
    let viewing_key1 = JSON.parse(str1).create_viewing_key.key;
    
    await expect(contract.query.balance({ "address": contract_owner.account.address, "key": viewing_key0},contract_owner)).to.respondWith({'amount':999999000});
    await expect(contract.query.balance({ "address": other.account.address, "key": viewing_key1},contract_owner)).to.respondWith({'amount':1000});
  })
});
