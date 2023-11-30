export { }

import { JsonRpcProvider } from "@ethersproject/providers"
import { ethers } from "ethers";
import { SimpleAccountAPI, wrapProvider } from "@account-abstraction/sdk";
import { DefaultGasOverheads } from "@account-abstraction/sdk";

const rpcUrl = "https://public.stackup.sh/api/v1/node/ethereum-sepolia";
const paymasterUrl = "https://api.stackup.sh/v1/paymaster/14270a069b7e95efda8ebf502132e2379c688d4bcd21bed939f84d53c2cb4981";
const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const providerUrl = "https://sepolia.infura.io/v3/b2b8c9e52dd34ab0b3b3be6a72c093af";

const provider = new JsonRpcProvider(providerUrl);
const factoryAddress = "0x9406Cc6185a346906296840746125a0E44976454";
const signingKey = "0x4337433743374337433743374337433743374337433743374337433743374337";
const owner = new ethers.Wallet(signingKey);
const accountAPI = new SimpleAccountAPI({
  provider,
  entryPointAddress,
  owner,
  factoryAddress,
  overheads: {
    zeroByte: DefaultGasOverheads.nonZeroByte,
  },
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const info = {
    uuid: "350670db-19fa-4704-a166-e52e178b59d2",
    name: "Example Wallet",
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
    rdns: "com.example.wallet"
  };

  const config = {
    bundlerUrl: rpcUrl,
    entryPointAddress
  };

  const wrappedProvider = await wrapProvider(provider, config, owner);

  window.dispatchEvent(
    new CustomEvent("eip6963:announceProvider", {
      detail: { 
        info,
        provider: wrappedProvider
      },
    })
  );
});