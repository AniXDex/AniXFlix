"use client";
import ModalMovies from "@/components/modals/ModalMovies";
import { useGlobalContext } from "@/context/globalContext";
import React from "react";
import { AnimatePresence } from "motion/react";

interface Props {
  children: React.ReactNode;
}

function ModalProvider({ children }: Props) {
  const { isModalOpen, modalKey } = useGlobalContext();
  return (
    <>
      <AnimatePresence>
        {isModalOpen && modalKey === "add-movie" && (
          <ModalMovies key={"add-movie"} />
        )}
      </AnimatePresence>
      {children}
    </>
  );
}

export default ModalProvider;
