console.log("External Script Loaded")
const { ethereum } = window;
const connectButton = document.getElementById('connectButton')
const activeAccountId = document.getElementById('activeAccount')
let accounts;
let activeAccount;

const initialize = async ()=> {
    if(ethereum.isConnected){
        console.log("Already connected")
        await loadActiveAccount()
    }else {
        console.log("Ethereum not connected")
        activeAccountId.innerText = null;
        initializeOnboarding();
    }
}

const loadActiveAccount = async ()=>{
    const activeAccounts = await ethereum.request({method: 'eth_accounts'})
    console.log("Active accounts", activeAccounts)
    if(activeAccounts.length>0){
        activeAccount = activeAccounts[0];
        activeAccountId.innerText = `WalletID: ${activeAccount}`;
        connectButton.innerText = 'Wallet Connected';
    }else{
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

if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', (newAccounts) => {
        accounts = newAccounts;
        initializeOnboarding();
        loadActiveAccount()
    });
}

window.addEventListener('DOMContentLoaded',initialize)