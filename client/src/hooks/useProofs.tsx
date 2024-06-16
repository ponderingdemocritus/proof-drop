import { useEffect, useState } from "react";

export const useProofs = () => {
  const [proofDrops, setProofDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const response = await fetch("/api/drops");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log(data);
        setProofDrops(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProofs();
  }, []);

  return {
    proofDrops,
    loading,
    error,
  };
};
