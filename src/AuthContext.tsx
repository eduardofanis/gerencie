import React from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "./main";
import { Timestamp, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { toast } from "./components/ui/use-toast";

type ContextProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>> | null;
  subscription: boolean;
  loading: boolean;
};

type DataProps = {
  tiposDeOperacoes: [];
  plano: "Individual" | "Time" | "Empresarial";
  dataDeVencimento: Timestamp;
};

export const AuthContext = React.createContext<ContextProps>({
  user: null,
  setUser: null,
  subscription: false,
  loading: true,
});

export default function AuthStorage({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [subscription, setSubscription] = React.useState(true);

  React.useEffect(() => {
    const authState = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (currentUser) {
        setUser(currentUser);
        const unsubscribe = onSnapshot(
          doc(db, currentUser.uid, "data"),
          (docSnapshot) => {
            const docRef = docSnapshot.data() as DataProps;
            if (docRef && docRef.dataDeVencimento.toDate() < new Date()) {
              setSubscription(false);
              toast({
                title:
                  "Sua assinatura venceu, renove para continuar utilizando o gerencie.",
                variant: "destructive",
                duration: 99999999999999,
              });
            } else setSubscription(true);
          }
        );
        return () => {
          if (unsubscribe) unsubscribe();
        };
      } else {
        setUser(null);
      }
    });

    return () => {
      if (authState) authState();
    };
  }, [auth, db]);

  return (
    <AuthContext.Provider value={{ user, setUser, subscription, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
