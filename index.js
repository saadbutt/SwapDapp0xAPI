const BigNumber = require('bignumber.js');
const qs = require('qs');
const web3 = require('web3');

let currentTrade = {};
let currentSelectSide;
let tokens;
const erc20abi= [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]

async function init() {
    await listAvailableTokens();
}

async function listAvailableTokens(){
    console.log("initializing");
    let response = await fetch('https://tokens.coingecko.com/uniswap/all.json');
   // let response = await fetch('https://tokens.uniswap.org/');
//    let response = {"name":"CoinGecko","logoURI":"https://www.coingecko.com/assets/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png",
//    "keywords":["defi"],"timestamp":"2022-12-25T11:06:30.979+00:00","tokens":
//    [{
//     "name": "Uniswap",
//     "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
//     "symbol": "UNI",
//     "decimals": 18,
//     "chainId": 5,
//     "logoURI": "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
//   },
//   {
//     "name": "Wrapped Ether",
//     "address": "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
//     "symbol": "WETH",
//     "decimals": 18,
//     "chainId": 5,
//     "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6/logo.png"
//   }],"version":{"major":1157,"minor":0,"patch":0}};

    let tokenListJSON = await response.json(); 
    console.log("listing available tokens: ", tokenListJSON);
    tokens = tokenListJSON.tokens;
    console.log("tokens: ", tokens);

    // Create token list for modal
    let parent = document.getElementById("token_list");
    for (const i in tokens){
        // Token row in the modal token list
        let div = document.createElement("div");
        div.className = "token_row";
        let html = `
        <img class="token_list_img" src="${tokens[i].logoURI}">
          <span class="token_list_text">${tokens[i].symbol}</span>
          `;
        div.innerHTML = html;
        div.onclick = () => {
            selectToken(tokens[i]);
        };
        parent.appendChild(div);
    };
}

async function selectToken(token){
    closeModal();
    currentTrade[currentSelectSide] = token;
    console.log("currentTrade: ", currentTrade);
    renderInterface();
}

function renderInterface(){
    if (currentTrade.from){
        console.log(currentTrade.from)
        document.getElementById("from_token_img").src = currentTrade.from.logoURI;
        document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol;
    }
    if (currentTrade.to){
        console.log(currentTrade.to)
        document.getElementById("to_token_img").src = currentTrade.to.logoURI;
        document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
    }
}

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            console.log("connecting");
            await ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.log(error);
        }
        document.getElementById("login_button").innerHTML = "Connected";
        // const accounts = await ethereum.request({ method: "eth_accounts" });
        document.getElementById("Approve_0x_button").disabled = false;
        document.getElementById("swap_button").disabled = false;
    } else {
        document.getElementById("login_button").innerHTML = "Please install MetaMask";
    }
}

async function approve0x() {
    try {

        // Only work if MetaMask is connect
        // Connecting to Ethereum: Metamask
        const web3 = new Web3(Web3.givenProvider);

        // The address, if any, of the most recently used account that the caller is permitted to access
        let accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts[0] == null) {
            document.getElementById("Approve_0x_button").disabled = false;
            return
        }
        let takerAddress = accounts[0];
        if (currentTrade.from) {
            const ERC20TokenContract = new web3.eth.Contract(erc20abi, currentTrade.from.address);
                                                                // // goerli address
            ERC20TokenContract.methods.allowance(takerAddress, "0xdef1c0ded9bec7f1a1670819833240f027b25eff").call().then(
                async function(tx) {
                    console.log("tx:", tx);
                    if (tx == 0) {
                        const maxApproval = new BigNumber(2).pow(256).minus(1);

                        // Grant the allowance target an allowance to spend our tokens.
                        const txApp = await ERC20TokenContract.methods.approve(
                            "0xdef1c0ded9bec7f1a1670819833240f027b25eff", // goerli address
                            maxApproval,
                        )
                        .send({ from: takerAddress, gasLimit: 60000 })
                        .then(tx => {
                            console.log("tx: ", tx)
                        });
                    } else {
                        document.getElementById("Approve_0x_button").innerHTML = "Approved";
                    }
                }
            )
        }
    } catch (error) {
        console.log(error);
        document.getElementById("Approve_0x_button").disabled = false;
        return
    }
}

function openModal(side){
    currentSelectSide = side;
    document.getElementById("token_modal").style.display = "block";
}

function closeModal(){
    document.getElementById("token_modal").style.display = "none";
}

async function getPrice() {
    console.log("Getting Price");
  
    if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
    let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  
    const params = {
        sellToken: currentTrade.from.address,
        buyToken: currentTrade.to.address,
        sellAmount: amount,
    }
  
    // Fetch the swap price.
    const response = await fetch(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`);
    
    swapPriceJSON = await response.json();
    console.log("Price: ", swapPriceJSON);
    
    document.getElementById("to_amount").value = swapPriceJSON.buyAmount / (10 ** currentTrade.to.decimals);
    document.getElementById("gas_estimate").innerHTML = swapPriceJSON.estimatedGas;
    // document.getElementById("Approve_0x_button").disabled = true;
    document.getElementById("token_selected").innerHTML = currentTrade.from.symbol;
}

async function getQuote(account) {
    try {
        console.log("Getting Quote");
    
        if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
        let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
    
        const params = {
            sellToken: currentTrade.from.address,
            buyToken: currentTrade.to.address,
            sellAmount: amount,
            takerAddress: account,
            buyTokenPercentageFee: 0.1 ,
            feeRecipient: "0xB24D6E49391E5fEDc800808866aF2FE23662694f",
        }

        console.log("params:",params)
        // Fetch the swap quote.
        const response = await fetch(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`);
        console.log("response:",response);
        console.log("sttus:", response.status, response.type);
        if (response.status == 400) {
            document.getElementById("errorarea").innerHTML = "error occured, status"+response.status ;
        }
        swapQuoteJSON = await response.json();
        console.log("Quote: ", swapQuoteJSON);
        
        document.getElementById("to_amount").value = swapQuoteJSON.buyAmount / (10 ** currentTrade.to.decimals);
        document.getElementById("gas_estimate").innerHTML = swapQuoteJSON.estimatedGas;

        return swapQuoteJSON;
    } catch(error){
        console.log("error::::::", error);
    }
}

async function trySwap(){
    console.log("trying swap");
    // Only work if MetaMask is connect
    // Connecting to Ethereum: Metamask
    const web3 = new Web3(Web3.givenProvider);

    // The address, if any, of the most recently used account that the caller is permitted to access
    let accounts = await ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];
    console.log("takerAddress: ", takerAddress);
  
    const swapQuoteJSON = await getQuote(takerAddress);
    console.log("swapQuoteJSON:",swapQuoteJSON)
    // Set Token Allowance
    // Set up approval amount
    const fromTokenAddress = currentTrade.from.address;
    const maxApproval = new BigNumber(2).pow(256).minus(1);
    console.log("approval amount: ", maxApproval);
    const ERC20TokenContract = new web3.eth.Contract(erc20abi, fromTokenAddress);
    console.log("setup ERC20TokenContract: ", ERC20TokenContract);
    console.log("swapQuoteJSON.allowanceTarget:",swapQuoteJSON.allowanceTarget, maxApproval)
    // Grant the allowance target an allowance to spend our tokens.
    const tx = await ERC20TokenContract.methods.approve(
        swapQuoteJSON.allowanceTarget,
        maxApproval,
    )
    .send({ from: takerAddress })
    .then(tx => {
        console.log("tx: ", tx)
    });

    // Perform the swap
    const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
    console.log("receipt: ", receipt);
}

init();

document.getElementById("login_button").onclick = connect;
document.getElementById("Approve_0x_button").onclick = approve0x;
document.getElementById("from_token_select").onclick = () => {
    openModal("from");
};
document.getElementById("to_token_select").onclick = () => {
    openModal("to");
};
document.getElementById("modal_close").onclick = closeModal;
document.getElementById("from_amount").oninput = getPrice;
document.getElementById("swap_button").onclick = trySwap;