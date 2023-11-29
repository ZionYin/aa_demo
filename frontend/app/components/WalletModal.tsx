import { EIP6963ProviderDetail, EIP1193Provider } from '@wagmi/mipd';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function WalletModal({ show, handleClose, wallets }: { show: boolean, handleClose: () => void, wallets: EIP6963ProviderDetail[] }) {
    const connectWallet = async (provider: EIP1193Provider) => {
        const addresses = await provider.enable();
        alert(`Connected to ${addresses[0]}`)
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Wallets</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    wallets.map((wallet: EIP6963ProviderDetail) => {
                        return <div className="mb-3">
                            <Button onClick={() => connectWallet(wallet.provider)}>
                                <img src={wallet.info.icon} className="w-6 h-6 inline-block mr-2" />
                                <span>Connect to {wallet.info.name}</span>
                            </Button>
                        </div>
                    })
                }
            </Modal.Body>
        </Modal>
    );
}