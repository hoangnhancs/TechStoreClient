import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayTime: number): T {
    const [debounceValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delayTime);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delayTime]);

    return debounceValue;
}