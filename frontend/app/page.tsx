"use client";

import Image from 'next/image'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { MetaMaskButton } from '@metamask/sdk-react-ui';
import { greeterAddress, greeterAbi } from '../config'

export default function Home() {
  const [greeting, setGreetingValue] = useState('')
  const [greetingDisplay, setGreetingDisplay] = useState('')

  const getGreeting = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum!)
    const signer = await provider.getSigner()
    const greeter = new ethers.Contract(greeterAddress, greeterAbi, signer)
    const greeting = await greeter.greet()
    setGreetingDisplay(greeting)
  }

  const setGreeting = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum!)
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
        </div>
      </div>
    </main>
  )
}
