# Secret Contracts Factorial Example

This template contains factorial example contracts.
The contract is created with a parameter for which the factorial is calculated.

# Contract Functions
- `factorial`: Only the owner can set to a specific number.
- `get_factorial`: Any user can use this function to see current factorial value.

# Compiling contracts

Use this command to compile your contracts: 
`polar compile`

# Run script

`polar run scripts/sample-script.js`

# Deploying contracts

In `scripts` folder:

First of all you need to create an instance of your contract using contract name.
```js
const contract = new Contract('factorial', runtimeEnv);

// To deploy your contract
const deploy_response = await contract.deploy(account);

// To initialize your contract
await contract.instantiate({"factorial": 1}, "deploy test", account);
```

Note: You can check out your contract information in `deploy_response`.

# Interact with contracts

`polar` will load functions using schema, you can call contract functions using `contract.tx`(to execute transactions) and `contract.query`(to query from contract)
```js
// To interact with your contract
// The factorial of the number will get calculated and get stored in the contract state.
await contract.tx.factorial(number, account);

// It will fetch the factorial from the contract state.
await contract.query.get_factorial();
```
