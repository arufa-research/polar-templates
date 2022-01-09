const { Contract, getAccountByName } = require("secret-polar");

async function run () {
  const contract_owner = getAccountByName("account_0");
  const contract = new Contract("snip-20");
  await contract.parseSchema();

  const deploy_response = await contract.deploy(contract_owner);
  console.log(deploy_response);

  const contract_info = await contract.instantiate(
    {
      "decimals": 6,
      "name": "SampleSnip",
      "prng_seed": "YWE",
      "symbol": "SMPL"
    },
    "deploy test kdhfkjdfhkjd",
    contract_owner
  );
  console.log(contract_info);

  // const mint_response = await contract.tx.mint(
  //   {account: contract_owner},
  //   5000000,
  //   contract_owner.account.address
  // );
  // console.log(mint_response);

  const response = await contract.query.token_info();
  console.log(response);
}

module.exports = { default: run };
