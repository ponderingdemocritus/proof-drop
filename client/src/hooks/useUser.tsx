import { useEffect, useState } from "react";

import { useAccount } from "wagmi";
import { client } from "@/App";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { address } = useAccount();

  const fetchUser = async () => {
    try {
      const response = await client.users.$get({ query: { address } });

      const data = await response.json();

      setUser(data.success == true ? data.user : null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
  };
};
