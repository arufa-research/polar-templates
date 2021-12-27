const { Contract, getAccountByName } = require("secret-polar");

async function run () {
  const contract_owner = getAccountByName("account_0");
  const contract = new Contract('snip-20');
  await contract.parseSchema();

  const deploy_response = await contract.deploy(contract_owner);
  console.log(deploy_response);

  const contract_info = await contract.instantiate(
    {"name": "asset snip-20", "symbol": "as", "decimals": 6, "prng_seed": 0},
    "deploy snip-20",
    contract_owner
  );
  console.log(contract_info);

  // const ex_response = await contract.tx.factorial(5, contract_owner);
  // console.log(ex_response);

  // const response = await contract.query.get_factorial();
  // console.log(response);
}

module.exports = { default: run };
