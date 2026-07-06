"use client";
import React from "react";
import { GlobalContextProvider } from "@/context/globalContext";
import { TooltipProvider } from "@/components/ui/tooltip";

interface Props {
  children: React.ReactNode;
}

function ContextProvider({ children }: Props) {
  return (
    <GlobalContextProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </GlobalContextProvider>
  );
}

export default ContextProvider;
