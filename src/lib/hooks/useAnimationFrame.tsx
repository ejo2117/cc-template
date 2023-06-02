"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const useAnimationFrame = (
  callback: FrameRequestCallback,
  runCondition = true
) => {
  const requestRef = useRef<number>();
  const timerStartRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [deltaTime, setDeltaTime] = useState(0);

  // There's a great explanation of this approach here https://css-tricks.com/using-requestanimationframe-with-react-hooks/
  const step: FrameRequestCallback = useCallback(
    (timestamp) => {
      if (timerStartRef.current && previousTimeRef.current) {
        setTimeElapsed(timestamp - timerStartRef.current);
        setDeltaTime(timestamp - previousTimeRef.current);
      }
      previousTimeRef.current = timestamp;
      requestRef.current = window.requestAnimationFrame(step);
      callback && callback(timestamp);
    },
    [callback]
  );

  useEffect(() => {
    if (runCondition) {
      timerStartRef.current = performance.now();
      requestRef.current = window.requestAnimationFrame(step);
    }
    return () => {
      !!requestRef.current && window.cancelAnimationFrame(requestRef.current);
    };
  }, [runCondition, step]);

  return [timeElapsed, deltaTime] as const;
};

export { useAnimationFrame };
