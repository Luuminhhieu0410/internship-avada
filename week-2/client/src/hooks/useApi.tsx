import { useCallback, useMemo } from "react";
import { BASE_URL } from "../constant/server";

export function useAPI() {
  const headers = useMemo(
    () => new Headers({ "Content-Type": "application/json" }),
    []
  );

  const request = useCallback(
    async (endpoint: string, options: RequestInit) => {
      try {
        const res = await fetch(BASE_URL + endpoint, {
          headers,
          ...options,
        });
        if (!res.ok) {
          const ErrorMesApi = await res.json();
          throw new Error(ErrorMesApi.message);
        }
        return await res.json();
      } catch (error) {
        console.error("Error request:", error);
        throw error;
      }
    },
    [headers]
  );

  const get = useCallback(
    (endpoint: string, options: RequestInit = {}) => {
      return request(endpoint, { ...options, method: "GET" });
    },
    [request]
  );

  const post = useCallback(
    (endpoint: string, body: unknown, options: RequestInit = {}) => {
      return request(endpoint, {
        headers,
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    []
  );

  const put = useCallback(
    (endpoint: string, body: unknown = {}, options: RequestInit = {}) => {
      
      return request(endpoint, {
        headers,
        ...options,
        method: "PUT",
        body: JSON.stringify(body),
      });
    },
    []
  );

  const del = useCallback(
    (endpoint: string,  options: RequestInit = {}) => {
      return request(endpoint, {
        headers,
        ...options,
        method: "DELETE",
       
      });
    },
    []
  );

  return { get, post, put, del };
}
