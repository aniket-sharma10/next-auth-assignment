"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);

  
  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role); // Setting role only after session is available
    }
  }, [session]);

  const handleDashboardClick = (path: string) => {
    if (userRole !== "admin") {
      toast({ description: "This page is reserved for admins only.", variant: "destructive" });
    } else {
      window.location.href = path;
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center w-full">Loading...</div>;
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm relative">
      <div className="text-lg font-semibold">Next Auth</div>
      <div className="flex-grow flex justify-center space-x-4">
        <Button variant="link" onClick={() => (window.location.href = "/")}>
          Home
        </Button>
        <Button variant="link" onClick={() => handleDashboardClick("/dashboard")}>
          Dashboard
        </Button>
      </div>

    </nav>
  );
};

export default Navbar;
