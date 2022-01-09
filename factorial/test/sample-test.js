const { expect, use } = require("chai");
const { Contract, getAccountByName, polarChai } = require("secret-polar");

use(polarChai);

describe("factorial", () => {
  async function setup() {
    const contract_owner = getAccountByName("account_1");
    const other = getAccountByName("account_0");
    const contract = new Contract("factorial");
    await contract.parseSchema();

    return { contract_owner, other, contract };
  }

  it("deploy and init", async () => {
    const { contract_owner, other, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);

    const contract_info = await contract.instantiate({"factorial": 0}, "deploy test", contract_owner);

    await expect(contract.query.get_factorial()).to.respondWith({ 'factorial': 0 });
  });

  it("calculate factorial", async () => {
    const { contract_owner, other, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);

    const contract_info = await contract.instantiate({"factorial": 0}, "deploy test", contract_owner);

    const ex_response = await contract.tx.factorial({account: contract_owner}, 4);
    await expect(contract.query.get_factorial()).to.respondWith({ 'factorial': 24 });
  });

  it("recalculate factorial", async () => {
    const { contract_owner, other, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);

    const contract_info = await contract.instantiate({"factorial": 0}, "deploy test", contract_owner);

    const ex_response = await contract.tx.factorial({account: contract_owner}, 4);
    await expect(contract.query.get_factorial()).to.respondWith({ 'factorial': 24 });

    const ex_response_1 = await contract.tx.factorial({account: contract_owner}, 3);
    await expect(contract.query.get_factorial()).to.respondWith({ 'factorial': 6 });
  });
});
