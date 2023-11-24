"use client";

import { ethers } from 'ethers'
import { JsonRpcProvider } from "@ethersproject/providers";
import { useState, useEffect } from 'react'
import { greeterAddress, greeterAbi } from '@/config'
import { PaymasterAPI, calcPreVerificationGas, SimpleAccountAPI } from '@account-abstraction/sdk';
import { UserOperationStruct } from '@account-abstraction/contracts';
import { HttpRpcClient } from '@account-abstraction/sdk';
import { VerifyingPaymasterAPI } from '@/utils/VerifyingPaymasterAPI';

const rpcUrl = "https://public.stackup.sh/api/v1/node/ethereum-sepolia";
const paymasterUrl = "https://public.stackup.sh/api/v1/paymaster/ethereum-sepolia";
// Create the paymaster API
const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const paymaster = new VerifyingPaymasterAPI(paymasterUrl, entryPointAddress);

export default function Paymaster() {
    const [greeting, setGreetingValue] = useState('')
    const [greetingDisplay, setGreetingDisplay] = useState('')

    const help = async () => {
        // Initialize the account
        const provider = new JsonRpcProvider(rpcUrl);
        const factoryAddress = "0x9406Cc6185a346906296840746125a0E44976454";
        const signingKey = "0x4337433743374337433743374337433743374337433743374337433743374337";
        const owner = new ethers.Wallet(signingKey);
        const accountAPI = new SimpleAccountAPI({
            provider,
            entryPointAddress,
            owner,
            factoryAddress
        });
        console.log("provider: ", provider);
        console.log("owner: ", owner);
        console.log("accountAPI: ", accountAPI);

        const address = await accountAPI.getCounterFactualAddress();
        console.log(`Account address: ${address}`);
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
