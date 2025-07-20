"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on authentication pages
  const hideNavbar = pathname.startsWith('/login') || pathname.startsWith('/test-login');
  
  if (hideNavbar) {
    return null;
  }
  
  return <Navbar />;
} 