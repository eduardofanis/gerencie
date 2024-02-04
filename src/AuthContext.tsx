import React from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "./main";

type ContextProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>> | null;
};

export const AuthContext = React.createContext<ContextProps>({
  user: null,
  setUser: null,
});

export default function AuthStorage({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = getAuth(firebaseApp);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (currentUser) setUser(currentUser);
      else setUser(null);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
