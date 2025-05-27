export interface User {
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  register: (userData: User) => void;
  logout: () => void;
}