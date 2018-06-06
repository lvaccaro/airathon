Eth distribution on Azure
====

## Distribution
1. go to ethereum on ubuntu template: https://github.com/Azure/azure-quickstart-templates/tree/master/go-ethereum-on-ubuntu
2. click button "Open to Azure" to enter in Azure portal
3. build a new distribution:
	* resources group: gethgroups
	* storage account name prefix: gethstorage
	* vm dns prefix: gethdns
	* admin username: gethuser
	* admin password: ************
	* vm size: standard_d4 (with 8 cores, only available on US)
4. setup your system: install nodejs, vim, git


## Genesis
The file genesis.json contains the initial setup of ethereum distribution.
Change the default genesis file in order to: 
* set the configuration, like chain id and flags
* decrease the difficulty: mine with the default difficulty is to much expensive
* check to have the private key of the address defined in alloc area (as default in `priv_genesis.key`)
My modified genesis file is the following:

```
{
 "config": {
        "chainId": 15,
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
    },

  "alloc": {
    "7fbe93bc104ac4bcae5d643fd3747e1866f1ece4": {
      "balance": "1000000000000000000000000000000"
    }
  },

  "nonce": "0x0000000000000042",
  "difficulty": "0x00010",
  "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "timestamp": "0x00",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "extraData": "0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa",
  "gasLimit": "0x4c4b40"
}
```

## Start geth
1. set a geth folder, like `/opt/eth`
2. start a distribution: 
`$ geth --datadir /opt/eth/ init genesis.json`
3. import private key into your node: 
`$ geth --datadir /opt/eth/ account import priv_genesis.key `
4. run eth: 
`$ geth --datadir /opt/eth/ --maxpeers 0  --rpcapi "db,eth,net,web3"  --rpcport "8545"  --rpc --rpccorsdomain "*" console`
5. check accounts & balances:

```
> eth.accounts
["0x7fbe93bc104ac4bcae5d643fd3747e1866f1ece4"]
> eth.coinbase
"0x7fbe93bc104ac4bcae5d643fd3747e1866f1ece4"
> web3.fromWei(eth.getBalance(eth.coinbase), "ether")
1000000000000
```

## Manage account & transactions
1. create new account from a `private.key` file:

```
$ geth --datadir /opt/eth/ account import private.key
c03b350a0e291135cfabab820c06601a75d9bdba
```
2. send founds from coinbase to new account

```
> var sender = eth.coinbase;
> var receiver = eth.accounts[1];
> var amount = web3.toWei(10, "ether")
> personal.unlockAccount(eth.coinbase)
> eth.sendTransaction({from: sender, to: receiver, value: amount})
> web3.fromWei(eth.getBalance(receiver), "ether")
0
```
3. Mine to validate new transactions: specify the number of threads to use

```
> miner.start(8)
...
> miner.stop()
```
4. check new balance

```
> web3.fromWei(eth.getBalance(receiver), "ether")
10
```

## Problems
Geth doesn't support incoming connection for device behind routers in internal network. For this reason on Azure is not possible connect from [remix](https://remix.ethereum.org/) client and send & debug smart-contracts in remix interface.





