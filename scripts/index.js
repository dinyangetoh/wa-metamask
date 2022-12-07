console.log("External Script Loaded")
const {ethereum} = window;
const connectButton = document.getElementById('connectButton')
const activeAccountId = document.getElementById('activeAccount')
const sendTransactionButton = document.getElementById('sendTransaction')
let accounts = [];
let activeAccount;

const initialize = async () => {
    initializeOnboarding();
    if (ethereum.isConnected && (accounts.length === 0 || accounts.length > 0 && activeAccount !== accounts[0])) {
        console.log("Already connected")
        await loadActiveAccount()
    }
}

const loadActiveAccount = async () => {
    const activeAccounts = await ethereum.request({method: 'eth_accounts'})
    console.log("Active accounts", activeAccounts)
    if (activeAccounts.length > 0) {
        activeAccount = activeAccounts[0];
        activeAccountId.innerText = `WalletID: ${activeAccount}`;
        connectButton.innerText = 'Wallet Connected';
    } else {
        initializeOnboarding()
    }
}

const initializeOnboarding = () => {
    const onboarding = new MetaMaskOnboarding();
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
        connectButton.innerText = 'Click here to install MetaMask!';
        connectButton.onclick = () => {
            connectButton.innerText = 'Onboarding in progress';
            connectButton.disabled = true;
            onboarding.startOnboarding();
        };
    } else if (accounts && accounts.length > 0) {
        connectButton.innerText = 'Wallet Connected';
        connectButton.disabled = true;
        onboarding.stopOnboarding();
    } else {
        connectButton.innerText = 'Connect Wallet';
        console.log("Accounts", accounts)
        connectButton.onclick = async () => {
            await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
        };
    }
};

const sendTransaction = () => {
    console.log("Send transaction clicked")
    const value = ethers.utils.parseEther("0.11")
    const newValue = "0x" + value.toString();

    console.log({value, newValue})

    const params = [
        {
            from: activeAccount,
            to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567',
            value: value.toHexString(),
        }
    ];
    return ethereum.request({
        method: 'eth_sendTransaction',
        params,
    })
}

if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', async (newAccounts) => {
        accounts = newAccounts;
        initializeOnboarding();
        await loadActiveAccount()
    });
}

window.addEventListener('DOMContentLoaded', initialize)