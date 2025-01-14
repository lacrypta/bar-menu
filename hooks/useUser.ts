import { useContext, useEffect, useState } from "react";
import { ISignupRequestBody } from "../types/request";

import { db, onSnapshot, doc } from "../lib/public/firebase";
import { useAccount } from "wagmi";
import { IPermit, IUser } from "../types/crypto";
import { UserContext } from "../contexts/User";

export interface IUseUserResult {
  user?: IUser;
  isRegistered: boolean;
  permit?: IPermit;
  isLoading: boolean;
  signup(_args: ISignupRequestBody): void;
}

const ajaxSignup = async (requestData: ISignupRequestBody) => {
  await fetch("/api/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
};

const useUser = (): IUseUserResult => {
  const { address } = useAccount();

  const {
    isLoading,
    isRegistered,
    permit,
    user,
    setIsLoading,
    setIsRegistered,
    setPermit,
    setUser,
  } = useContext(UserContext);

  // Address
  useEffect(() => {
    if (!address) {
      return;
    }

    setIsLoading(true);
    const userRef = doc(db, "users", address);
    const unsubscribe = onSnapshot(userRef, {
      next: (snapshot) => {
        const data = snapshot.data();
        if (!data) {
          setUser(undefined);
          setPermit(undefined);
          setIsRegistered(false);
          setIsLoading(false);
          return;
        }
        setUser({
          username: data.username,
          address,
        });
        setPermit(data.permit);
        setIsRegistered(true);
        setIsLoading(false);
      },
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const signup = async (requestData: ISignupRequestBody) => {
    const { username, address } = requestData;
    const res = await ajaxSignup(requestData);
    console.dir(res);

    setIsRegistered(true);
    setUser({
      username: username,
      address: address,
    });
  };
  return { user, isRegistered, permit, isLoading, signup };
};

export default useUser;
