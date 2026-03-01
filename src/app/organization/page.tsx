"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function OrganizationPage() {
  useEffect(() => {
    redirect("/organization/list");
  }, []);

  return null;
}
