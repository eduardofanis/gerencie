import React from "react";
import { firebaseApp } from "../main";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { PermissionsProps, UserDataProps } from "../types/UserDataProps";
import { AuthContext } from "./AuthContext";

type Collaborator = {
  permissions: PermissionsProps;
};

type ContextProps = {
  collaborator: Collaborator | null;
};

export const CollaboratorContext = React.createContext<ContextProps>({
  collaborator: null,
});

export default function CollaboratorStorage({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = getFirestore(firebaseApp);

  const [collaborator, setCollaborator] = React.useState<Collaborator | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, user!.uid, "data"),
      async (docSnapshot) => {
        setLoading(false);
        const collaborator = docSnapshot.data() as UserDataProps;

        if (
          collaborator &&
          collaborator.gerenteUid &&
          collaborator.permissoes
        ) {
          setCollaborator({
            permissions: collaborator.permissoes,
          });
        } else {
          setCollaborator(null);
        }
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, db]);

  return (
    <CollaboratorContext.Provider
      value={{
        collaborator,
      }}
    >
      {!loading && children}
    </CollaboratorContext.Provider>
  );
}
