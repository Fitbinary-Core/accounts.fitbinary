"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function BranchesPage() {
  useEffect(() => {
    redirect("/branches/list");
  }, []);

  return null;
}
