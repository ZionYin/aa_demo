import { useEffect, useState } from "react"
import { JsonRpcProvider } from "@ethersproject/providers"

function IndexPopup() {
  const [data, setData] = useState("")

  let provider = new JsonRpcProvider("https://sepolia.infura.io/v3/b2b8c9e52dd34ab0b3b3be6a72c093af")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: "350px"
      }}>
      <h2>
        Welcome to your
        <a href="https://www.plasmo.com" target="_blank">
          {" "}
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup
