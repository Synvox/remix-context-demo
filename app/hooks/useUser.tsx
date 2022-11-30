import { createContext, ReactNode, useContext } from "react";
import type { User } from "~/getters/getUser";

const context = createContext<User | null>(null);

export function useUser() {
  return useContext(context)!;
}

export function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) {
  return <context.Provider value={user}>{children}</context.Provider>;
}
