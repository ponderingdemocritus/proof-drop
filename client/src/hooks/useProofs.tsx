import { client } from "@/App";
import { useEffect, useState } from "react";
import { z } from "zod";
import { CreateProofDropSchema } from "../../../api/src/types/index.ts";

export const useProofs = () => {
  const [proofDrops, setProofDrops] = useState<
    z.infer<typeof CreateProofDropSchema>[] | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProofs = async () => {
    try {
      const response = await client.drops.$get();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      console.log(data.drops);
      setProofDrops(data.drops);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  return {
    proofDrops,
    loading,
    error,
  };
};
