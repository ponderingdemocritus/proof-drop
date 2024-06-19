import { client } from "@/App";

import { useQuery } from "@tanstack/react-query";

export const useProofs = () => {
  const query = useQuery({
    queryKey: ["drops"],
    queryFn: async () => {
      const res = await client.drops.$get();
      return await res.json();
    },
  });

  return {
    proofDrops: query.data?.drops,
    loading: query.isLoading,
    error: query.error,
  };
};
