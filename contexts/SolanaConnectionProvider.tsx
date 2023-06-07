import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Connection,
} from "@solana/web3.js";

import { getFastestEndpoint } from "../utils";
import { ENDPOINTS, CHAIN_ID, CHAIN_NAME } from "../utils/constant";

export type ENV = "mainnet-beta" | "testnet" | "devnet" | "localnet";

const DEFAULT = ENDPOINTS[0];

interface ConnectionConfig {
  connection: Connection | null;
  endpoint: string;
  env: ENV;
  setEndpoint: (val: string) => void;
  chainId: number;
}

const ConnectionContext = React.createContext<ConnectionConfig>({
  endpoint: DEFAULT,
  setEndpoint: () => {},
  connection: new Connection(DEFAULT, "recent"),
  env: CHAIN_NAME,
  chainId: Number(CHAIN_ID),
});

export function ConnectionProvider({ children = undefined as any }) {
  const [endpoint, setEndpoint] = useState(DEFAULT);

  const connection = useMemo(
    () => new Connection(endpoint, "recent"),
    [endpoint]
  );

  const env = CHAIN_NAME;
  const chainId = Number(CHAIN_ID);

  useEffect(() => {
    (async () => {
      const endpoint = await getFastestEndpoint(ENDPOINTS);

      setEndpoint(endpoint);
    })();
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        endpoint,
        setEndpoint,
        connection,
        env,
        chainId,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionConfig() {
  const context = useContext(ConnectionContext);

  return {
    endpoint: context.endpoint,
    setEndpoint: context.setEndpoint,
    env: context.env,
    chainId: context.chainId,
  };
}

