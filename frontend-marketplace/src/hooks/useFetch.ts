import { useState, useEffect, useCallback } from 'react';
import axios from '../services/axios';

type useFetchReturnType<T> ={
  loading: boolean;
  error: string;
  data: T | undefined
}

const useFetch = <T>(uri: string | undefined, suspendRender: any = false, config: any = {}): useFetchReturnType<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string>('');

  const fetchDataFromUri = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(uri as string, config) as any;
      response.data && setData(response?.data?.data);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  }, [uri]);

  useEffect(() => {
    uri && !suspendRender && fetchDataFromUri();
  }, [uri, suspendRender]);

  return {
    loading,
    error,
    data
  }
}

export default useFetch;

export const useFetchV1 = <T>(uri: string | undefined, isCall: boolean = true, config: any = {}): useFetchReturnType<T> => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string>('');
  const fetchDataFromUri = useCallback(async () => {
    try {
      const response = await axios.get(uri as string, config) as any;
      response.data && ('data' in response.data) && setData(response?.data?.data);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  }, [uri]);

  useEffect(() => {
    if(uri && isCall) fetchDataFromUri();
  }, [uri, isCall, fetchDataFromUri]);

  return {
    loading,
    error,
    data
  }
}