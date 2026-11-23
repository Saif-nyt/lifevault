"use client";

import { useEffect, useRef, useState } from "react";

export function useApi(loader, deps = []) {
  const loaderRef = useRef(loader);
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [version, setVersion] = useState(0);
  const activeRef = useRef(true);

  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    activeRef.current = true;
    setState((current) => ({ ...current, loading: true, error: null }));

    loaderRef
      .current()
      .then((data) => {
        if (activeRef.current) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (activeRef.current) setState({ data: null, loading: false, error });
      });

    return () => {
      activeRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  function refresh() {
    setVersion((value) => value + 1);
  }

  return { ...state, refresh, setData: (data) => setState((current) => ({ ...current, data })) };
}

export function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
