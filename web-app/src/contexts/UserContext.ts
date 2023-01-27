import { createContext } from 'react';

type UserContextType = {
  user: {
    id?: string;
    firstname?: string;
    role?: string;
  } | null;
  setUser: (user: any) => void;
  loading: boolean;
};

// create context type to be user type or null and setUser function
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: (user: any) => {},
  loading: true,
});
