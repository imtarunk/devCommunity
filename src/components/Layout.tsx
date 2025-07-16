import React from "react";
import { NavbarDemo } from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <NavbarDemo />
    <main>{children}</main>
  </>
);

export default Layout;
