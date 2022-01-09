const { Contract, getAccountByName } = require("secret-polar");

async function run () {
  const contract_owner = getAccountByName("account_0");
  const counter_contract = new Contract("counter");
  const factorial_contract = new Contract("factorial");
  await counter_contract.parseSchema();
  await factorial_contract.parseSchema();

  const counter_deploy_response = await counter_contract.deploy(contract_owner);
  console.log(counter_deploy_response);

  const counter_contract_info = await counter_contract.instantiate({"count": 102}, "deploy test dugufgdu", contract_owner);
  console.log(counter_contract_info);

  const inc_response = await counter_contract.tx.increment({account: contract_owner});
  console.log(inc_response);

  const count_response = await counter_contract.query.get_count();
  console.log(count_response);

  const transferAmount = [{"denom": "uscrt", "amount": "15000000"}] // 15 SCRT
  const customFees = { // custom fees
    amount: [{ amount: "750000", denom: "uscrt" }],
    gas: "3000000",
  }
  const count_response_2 = await counter_contract.tx.increment(
    {account: contract_owner}
  );
  // const count_response_2 = await counter_contract.tx.increment(
  //   {account: contract_owner, transferAmount: transferAmount, customFees: customFees}
  // );
  console.log(count_response_2);

  const factorial_deploy_response = await factorial_contract.deploy(contract_owner);
  console.log(factorial_deploy_response);

  const factorial_contract_info = await factorial_contract.instantiate({"factorial": 0}, "factorial test 2", contract_owner);
  console.log(factorial_contract_info);

  const exec_response = await factorial_contract.tx.factorial({account: contract_owner}, 4);
  console.log(exec_response);

  const factorial_response = await factorial_contract.query.get_factorial();
  console.log(factorial_response);
}

module.exports = { default: run };
