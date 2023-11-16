import { AuthProvider } from "@arcana/auth";

let provider;
// get from eth_accounts
let from = ''

const auth = new AuthProvider(
  //"xar_live_d7c88d9b033d100e4200d21a5c4897b896e60063", {
  "xar_test_d24f70cd300823953dfa2a7f5b7c7c113356b1ad", {
  //network: "mainnet", //defaults to 'testnet'
  position: "right", //defaults to right
  theme: "light", //defaults to dark
  alwaysVisible: true, //defaults to true which is Full UI mode
  connectOptions: {
    compact: true
  },
  chainConfig: {
    chainId: "80001", //defaults to CHAIN.ETHEREUM_MAINNET
    rpcUrl: "https://rpc.ankr.com/polygon_mumbai" //defaults to 'https://rpc.ankr.com/eth'
  }
});

async function signTransaction() {
  try {
    const sig = await provider.request({
      method: 'eth_signTransaction',
      params: [
        {
          from,
          gasPrice: 0,
          to: '0xE28F01Cf69f27Ee17e552bFDFB7ff301ca07e780',
          value: '0x0de0b6b3a7640000',
        },
      ],
    })
    setResult(sig)
    document.querySelector("#result").innerHTML =
        "SignTransaction: Successful!";
    console.log({ sig })
  } catch (e) {
      console.log({ e });
  }
}

async function logout() {
  console.log("Requesting logout");
  try {
    await auth.logout();
    document.querySelector("#result").innerHTML =
      "Logout: You are now logged out!";
  } catch (e) {
    console.log({ e });
  }
}

async function initAuth() {
  console.log("Intantiating Auth... ");
  document.querySelector("#result").innerHTML =
    "Initializing Auth. Please wait...";
  try {
    await auth.init();
    console.log("Init auth complete!");
    provider = auth.getProvider();
    document.querySelector("#result").innerHTML =
      "Auth initialized. Now you can continue.";
    console.log({ provider });
  } catch (e) {
    console.log(e);
  }
}

export async function connectPasswordless() {
  console.log("Requesting passwordless login");
  try {
      const loginState = await auth.loginWithLink("shaloo@newfang.io");
      console.log(loginState);
      document.querySelector("#result").innerHTML = "Passwordless Login Status: "+loginState; 
    } catch (e) {
      console.log(e);
    }
}

export async function connectCognitoPNP() {
  try {
    await auth.connect();
    document.querySelector("#result").innerHTML =
      "Cognito: User logged in successfully via PNP!";
  } catch (e) {
    console.log(e);
  }
}

export async function connectCognito() {
  try {
    await auth.loginWithSocial('aws');
    document.querySelector("#result").innerHTML =
      "Cognito: User logged in successfully!";
  } catch (e) {
    console.log(e);
  }
}

async function getAccounts() {
  console.log("Requesting accounts");
  try {
    const accounts = await auth.provider.request({ method: "eth_accounts" });
    console.log({ accounts });
    from = accounts[0];
    document.querySelector("#result").innerHTML = accounts[0];
  } catch (e) {
    console.log(e);
  }
}

async function getUser() {
  console.log("Requesting user information...");
  try {
    const userinfo = await auth.getUser();
    console.log({ userinfo });
    document.querySelector("#result").innerHTML = "name:"+userinfo.name+", email:"+userinfo.email;
  } catch (e) {
    console.log(e);
  }
}

async function getLoginStatus() {
  console.log("Checking if user is logged in...");
  try {
    const loginState = await auth.isLoggedIn();
    console.log ({ loginState });
    document.querySelector("#result").innerHTML = "Login Status:"+loginState; 
  } catch (e) {
    console.log(e);
  }
}

async function addChain() {
  try {
    await auth.provider.request({
      method: "wallet_addEthereumChain",
      params: [{
          chainId: "4002",
          chainName: "Fantom Testnet",
          blockExplorerUrls: ["https://testnet.ftmscan.com/"],
          rpcUrls: ["https://rpc.testnet.fantom.network/"],
          nativeCurrency: {
            symbol: "FTM",
          }
        }]
    });
    document.querySelector("#result").innerHTML =
      "Fantom FTM Testnet chain added successfully!";
  } catch (e) {
    console.log({ e });
  }
}

async function switchChain() {
  try {
    await auth.provider.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "8081"
        }
      ]
    });
    document.querySelector("#result").innerHTML =
      "Switched to the Shardeum chain successfully!";
  } catch (e) {
    console.log({ e });
  }
}

initAuth();

document.querySelector("#Btn-CognitoPNP").addEventListener("click", () => { connectCognitoPNP(); });
document.querySelector("#Btn-Cognito").addEventListener("click", () => { connectCognito(); });
document.querySelector("#Btn-Passwordless").addEventListener("click", () => { connectPasswordless(); });
document.querySelector("#Btn-GetAccounts").addEventListener("click", getAccounts);
document.querySelector("#Btn-GetUser").addEventListener("click", getUser);
document.querySelector("#Btn-GetLoginStatus").addEventListener("click", getLoginStatus);
document.querySelector("#Btn-SignTxn").addEventListener("click", signTransaction);
document.querySelector("#Btn-AddChain").addEventListener("click", addChain);
document.querySelector("#Btn-SwitchChain").addEventListener("click", switchChain);
document.querySelector("#Btn-Logout").addEventListener("click", logout);
