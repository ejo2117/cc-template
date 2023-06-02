import React, { useCallback, useMemo, useRef, useState } from "react";
import { useControls } from "leva";
import { useAnimationFrame } from "../hooks/useAnimationFrame";

type CanvasProps = JSX.IntrinsicElements["canvas"] & {
  height: number;
  width: number;
  scale: number;
};

type Particle = {
  x: number;
  y: number;
  radius: number;
  move: (t: number) => Partial<Particle>;
  color: `#${string}`;
};

const Canvas = ({ height = 400, width = 400, scale }: CanvasProps) => {
  // Create a ref so we can interact with the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationStart = useRef(performance.now());

  // Stateful params all get controlled by Leva
  // Lets us update params live in the browser, but locks us into React
  const { animationRunning } = useControls({
    animationRunning: true,
  });

  // Get center coordinates
  const canvasCenterX = (scale * width) / 2;
  const canvasCenterY = (scale * height) / 2;

  // Black/White depending on user theme
  const baseColor =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "#fff"
      : "#000";

  // Ensures smooth animation
  // Define Bead updates here as a function of time
  // From the greatest StackOverflow answer of all time: https://stackoverflow.com/questions/66802877/change-speed-of-request-animation-frame
  const generateMovement = useCallback(
    (r: number, i: number, x?: number, y?: number, ring?: number) =>
      (t: number) => {
        const { abs, cos, sin, sqrt, tan, min, log } = Math;

        return {} as Partial<Particle>;
      },
    []
  );

  const draw = useCallback(
    (t: number) => {
      if (!canvasRef.current) return;

      const context = canvasRef.current.getContext("2d");

      // Wipe the canvas on every frame update
      context.clearRect(0, 0, height * scale, width * scale);
    },
    [height, scale, width]
  );

  useAnimationFrame((time) => {
    draw((time - animationStart.current) / 1000);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <canvas
        ref={canvasRef}
        height={height * scale}
        width={width * scale}
        style={{ height, width }}
      ></canvas>
    </div>
  );
};

export default Canvas;
