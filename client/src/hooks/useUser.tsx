import { useAccount } from "wagmi";
import { client } from "@/App";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { hc, InferResponseType, InferRequestType } from "hono/client";

const queryClient = new QueryClient();

export const useUser = () => {
  const { address } = useAccount();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await client.users.$get({ query: { address } });
      return await res.json();
    },
  });

  const $post = client.users.create.$post;

  const mutation = useMutation<
    InferResponseType<typeof $post>,
    Error,
    InferRequestType<typeof $post>["json"]
  >({
    mutationFn: async (user) => {
      const response = await $post({
        json: user,
      });

      return await response.json();
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  return {
    user: query.data,
    loading: query.isLoading,
    error: query.error,
    mutation,
  };
};
