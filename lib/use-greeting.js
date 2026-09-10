"use client";

import * as React from "react";
import { greeting } from "./utils";

/**
 * Hydration-safe time-of-day greeting: renders a stable default during SSR
 * and first hydration pass, then updates to the real local greeting.
 */
export function useGreeting() {
  const [g, setG] = React.useState("Good morning");
  React.useEffect(() => {
    setG(greeting());
  }, []);
  return g;
}
