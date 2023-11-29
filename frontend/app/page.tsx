"use client";

import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { MetaMaskButton } from '@metamask/sdk-react-ui';
import { greeterAddress, greeterAbi } from '../config'

import Link from 'next/link';
import WalletModal from './components/WalletModal'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore } from '@wagmi/mipd';
import { useSyncExternalStore } from 'react';


export default function Home() {
  const [greeting, setGreetingValue] = useState('')
  const [greetingDisplay, setGreetingDisplay] = useState('')
  const [showWallets, setShowWallets] = useState(false)
  const store = createStore();
  const providers = useSyncExternalStore(store.subscribe, store.getProviders)

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
      <MetaMaskButton />
      <Link href="/paymaster"> Paymaster </Link>
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
          <div>
            <button
              className="p-2 border-2 border-black rounded-lg"
              onClick={() => setShowWallets(true)}
            >
              Get wallets
            </button>
          </div>
        </div>
      </div>
      <WalletModal
        show={showWallets}
        handleClose={() => setShowWallets(false)}
        wallets={providers}
      />
    </main>
  )
}
