export {}

let provider: EIP1193Provider

window.ethereum = provider

function announceProvider() {
  const info: EIP6963ProviderInfo = {
    uuid: "",
    name: "Example Wallet",
    icon: "",
    rdns: ""
  }
  window.dispatchEvent(
    new CustomEvent("eip6963:announceProvider", {
      detail: Object.freeze({ info, provider })
    })
  )
}

window.addEventListener(
  "eip6963:requestProvider",
  (event: EIP6963RequestProviderEvent) => {
    announceProvider()
  }
)

announceProvider()
