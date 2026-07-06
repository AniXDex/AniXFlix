"use client";
import React, { useEffect } from "react";
import DisableDevtool from "disable-devtool";

export default function DisableDevtoolWrapper() {
  useEffect(() => {
    DisableDevtool({
      // The secret tkName to bypass the devtool block
      // Usage: https://anixflix.com/?anix-dd
      tkName: 'anix-dd',
      // Optional settings
      disableMenu: true,
      clearLog: true,
    });
  }, []);

  return null;
}
