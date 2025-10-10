"use client";

import React from "react";
import { Button } from "@workspace/ui-core/components/button";
import TestComponent from "@workspace/ui-template-management/components/TestComponent";

export default function Page() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>OSS Template Management</h1>
      <p>This is the demo page for the OSS Template Management.</p>
      <Button onClick={() => alert("Button clicked")}>Click Me</Button>
      <TestComponent />
    </div>
  );
}

