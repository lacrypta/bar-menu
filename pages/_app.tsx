import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
// import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { ThemeProvider } from "@mui/material";

import { themeOptions } from "../styles/theme";
import { CartProvider } from "../contexts/Cart";

import { StepsProvider } from "../contexts/Steps";
import { OrderProvider } from "../contexts/Order";
import { getMenuItems } from "../lib/public/menu";
import { LoadingProvider } from "../contexts/Loading";
import { UserProvider } from "../contexts/User";
import { GatewayProvider } from "../plugins/gateway/contexts/Gateway";

import BarGatewayDeployment from "@lacrypta/bar-gateway/deployments/matic/BarGateway.json";
import { useEffect, useState } from "react";

const GATEWAY_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_GATEWAY_CONTRACT || BarGatewayDeployment.address;

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.polygon,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [chain.polygonMumbai]
      : []),
  ],
  [
    // alchemyProvider({
    //   // This is Alchemy's default API key.
    //   // You can get your own at https://dashboard.alchemyapi.io
    //   apiKey: "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
    // }),
    publicProvider(),
    // jsonRpcProvider({
    //   rpc: () => ({
    //     http: process.env.NEXT_PUBLIC_RPC_ADDRESS || `http://127.0.0.1:8545/`,
    //   }),
    // }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "La Crypta - Menu Bar",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [menuItems, setMenuItems] = useState<any>([]);
  useEffect(() => {
    getMenuItems().then((res) => setMenuItems(res));
  }, []);

  return (
    <StepsProvider>
      <ThemeProvider theme={themeOptions}>
        <LoadingProvider>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
              modalSize='compact'
              theme={darkTheme()}
              chains={chains}
            >
              <GatewayProvider address={GATEWAY_CONTRACT_ADDRESS}>
                <UserProvider>
                  <CartProvider menu={menuItems}>
                    <OrderProvider>
                      <Component {...pageProps} />
                    </OrderProvider>
                  </CartProvider>
                </UserProvider>
              </GatewayProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </LoadingProvider>
      </ThemeProvider>
    </StepsProvider>
  );
}

export default MyApp;
