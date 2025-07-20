import { useEffect, useRef, useState } from "react";

export function useCountUp(end: number, duration = 1000) {
  const [count, setCount] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    let start: number | null = null;
    const diff = end - previous.current;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(previous.current + progress * diff));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        previous.current = end; // cập nhật base sau animation
      }
    };

    requestAnimationFrame(step);
  }, [end, duration]);

  return count;
}