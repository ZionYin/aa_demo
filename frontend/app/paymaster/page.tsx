"use client";

import { ethers } from 'ethers'
import { JsonRpcProvider } from "@ethersproject/providers";
import { useState, useEffect } from 'react'
import { greeterAddress, greeterAbi } from '@/config'
import { SimpleAccountAPI } from '@account-abstraction/sdk';
import { VerifyingPaymasterAPI } from '@/utils/VerifyingPaymasterAPI';
import { HttpRpcClient, DefaultGasOverheads } from "@account-abstraction/sdk";
import { config } from 'process';


const rpcUrl = "https://public.stackup.sh/api/v1/node/ethereum-sepolia";
const paymasterUrl = "https://api.stackup.sh/v1/paymaster/14270a069b7e95efda8ebf502132e2379c688d4bcd21bed939f84d53c2cb4981";
const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const providerUrl = "https://sepolia.infura.io/v3/b2b8c9e52dd34ab0b3b3be6a72c093af"

export default function Paymaster() {
    const [greeting, setGreetingValue] = useState('')
    const [greetingDisplay, setGreetingDisplay] = useState('')

    const help = async () => {
        // Create the paymaster API
        // const paymasterAPI = new VerifyingPaymasterAPI(paymasterUrl, entryPointAddress);

        // Initialize the account
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

        const address = await accountAPI.getAccountAddress();
        console.log(`Account address: ${address}`);



        // Encode the calls
        const greeter = new ethers.Contract(greeterAddress, greeterAbi, provider);
        const callTo = greeterAddress;
        const callData = greeter.interface.encodeFunctionData("setGreeting", [greeting]);

        // Build the user operation
        const accountContract = await accountAPI._getAccountContract();
        // const fee = await provider.send("eth_maxPriorityFeePerGas", []);
        // const block = await provider.getBlock("latest");
        // const tip = ethers.BigNumber.from(fee);
        // const buffer = tip.div(100).mul(13);
        // const maxPriorityFeePerGas = tip.add(buffer);
        // const maxFeePerGas = block.baseFeePerGas
        //     ? block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas)
        //     : maxPriorityFeePerGas;

        // console.log(`Max priority fee per gas: ${maxPriorityFeePerGas}`);
        // console.log(`Max fee per gas: ${maxFeePerGas}`);
        console.log("callTo: ", callTo)
        console.log("callData: ", callData)
        console.log("accountContract: ", accountContract)

        const op = await accountAPI.createSignedUserOp({
            target: greeterAddress,
            data: greeter.interface.encodeFunctionData("setGreeting", [greeting]),
        });

        // const op = await accountAPI.createSignedUserOp({
        //     target: address,
        //     data: accountContract.interface.encodeFunctionData("execute", [callTo, 0, callData]),
        //     ... { maxFeePerGas, maxPriorityFeePerGas }
        // });
        // const op = await accountAPI.createSignedUserOp({
        //     target: greeterAddress,
        //     data: accountContract.interface.encodeFunctionData("executeBatch", [callTo, callData]),
        //     ... { maxFeePerGas, maxPriorityFeePerGas }
        // });

        console.log("Signed User Operation: ");
        console.log(op);

        // Send the user operation
        const chainId = await provider.getNetwork().then((net => net.chainId));
        const client = new HttpRpcClient(rpcUrl, entryPointAddress, chainId);
        // const userOpHash = await client.sendUserOpToBundler(op);

        console.log("Waiting for transaction...");
        // const transactionHash = await accountAPI.getUserOpReceipt(userOpHash);
        // console.log(`Transaction hash: ${transactionHash}`);
        // const tx = await provider.getTransaction(transactionHash!);
        // const receipt = await tx.wait();
        // console.log(`View here: https://jiffyscan.xyz/userOpHash/${userOpHash}`);
    }

    const getGreeting = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const signer = await provider.getSigner()
        const greeter = new ethers.Contract(greeterAddress, greeterAbi, signer)
        const greeting = await greeter.greet()
        setGreetingDisplay(greeting)
    }

    const setGreeting = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const signer = await provider.getSigner()
        const greeter = new ethers.Contract(greeterAddress, greeterAbi, signer)
        const tx = await greeter.setGreeting(greeting)
        await tx.wait()
    }

    useEffect(() => {
        getGreeting()
    }, [])




    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-6xl font-bold text-center">
                Welcome to the AA demo!
            </h1>
            <div className="flex flex-col items-center justify-center">
                <div>
                    <p className="text-2xl font-bold text-center">
                        The current greeting is:
                    </p>
                    <p className="text-2xl font-bold text-center">
                        {greetingDisplay}
                    </p>
                    <input
                        className="mb-4 p-2 border-2 border-black rounded-lg"
                        placeholder="Enter a greeting"
                        onChange={e => setGreetingValue(e.target.value)}
                    />
                    <button
                        className="p-2 border-2 border-black rounded-lg"
                        onClick={setGreeting}
                    >
                        Set greeting
                    </button>
                    <button
                        className="p-2 border-2 border-black rounded-lg"
                        onClick={help}
                    >
                        Help
                    </button>
                </div>
            </div>
        </main>
    )
}
