"use client";
import React, { useEffect } from "react";
import DisableDevtool from "disable-devtool";

export default function DisableDevtoolWrapper() {
  useEffect(() => {
    DisableDevtool({
      // Bypass: https://anixflix.com/?anix-dd
      tkName: "anix-dd",
      disableMenu: true,
      clearLog: true,
      disableSelect: true,
      disableCopy: true,
      disableCut: true,
      disablePaste: true,
    });
  }, []);

  return null;
}
