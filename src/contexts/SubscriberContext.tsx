import React from "react";
import { firebaseApp } from "../main";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { toast } from "../components/ui/use-toast";
import { UserDataProps } from "../types/UserDataProps";
import { AuthContext } from "./AuthContext";
import { getUserData } from "@/services/user";

type Subscriber = {
  nome: string;
  plano: "Empresarial" | "Time" | "Individual";
  dataDeVencimento: Date;
  limiteDeColaboradores: number;
};

type ContextProps = {
  subscriber: Subscriber | null;
};

export const SubscriberContext = React.createContext<ContextProps>({
  subscriber: null,
});

export default function SubscriberStorage({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = getFirestore(firebaseApp);

  const [subscriber, setSubscriber] = React.useState<Subscriber | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getUserData().then((userData) => {
      const gerenteUid = userData?.gerenteUid;

      const unsubscribe = onSnapshot(
        doc(db, gerenteUid ? gerenteUid : user!.uid, "data"),
        async (docSnapshot) => {
          setLoading(false);
          const subscriberData = docSnapshot.data() as UserDataProps;

          if (subscriberData && subscriberData.dataDeVencimento) {
            setSubscriber({
              nome: subscriberData.nome,
              plano: subscriberData.plano,
              dataDeVencimento: subscriberData.dataDeVencimento.toDate(),
              limiteDeColaboradores: subscriberData.plano === "Time" ? 3 : 50,
            });

            if (subscriberData.dataDeVencimento.toDate() < new Date()) {
              toast({
                title:
                  "Assinatura vencida, renove para continuar utilizando o gerencie.",
                variant: "destructive",
                duration: 99999999999999,
              });
            }
          } else {
            setSubscriber(null);
          }
        }
      );
      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }, [user, db]);

  return (
    <SubscriberContext.Provider
      value={{
        subscriber,
      }}
    >
      {!loading && children}
    </SubscriberContext.Provider>
  );
}
