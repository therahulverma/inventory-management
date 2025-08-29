import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Custom hook to fetch data from an API
 * @param {string} url - API endpoint
 * @param {object} options - Optional axios config (headers, params, etc.)
 */
const useFetchData = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(url, {
          cancelToken: source.token,
          ...options,
        });

        if (isMounted) {
          setData(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      source.cancel("Request cancelled on unmount");
    };
  }, [url]);

  console.log("FetchData:", data);
  return { data, loading, error };
};

export default useFetchData;
