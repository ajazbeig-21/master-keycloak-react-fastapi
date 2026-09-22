import { createContext, useContext, useMemo, useState } from "react";

const RoleContext = createContext(null);

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export function RoleProvider({ children }) {
  const [role, setRole] = useState(ROLES.USER);
  const [customerName, setCustomerName] = useState("Alex Customer");

  const value = useMemo(
    () => ({
      role,
      setRole,
      isAdmin: role === ROLES.ADMIN,
      isUser: role === ROLES.USER,
      customerName,
      setCustomerName,
    }),
    [role, customerName]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
