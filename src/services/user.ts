import { toast } from "@/components/ui/use-toast";
import { firebaseApp } from "@/main";
import { addDays } from "date-fns";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export async function userSignIn(email: string, password: string) {
  const auth = getAuth(firebaseApp);
  auth.useDeviceLanguage();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast({
      title: "Login efetuado com sucesso.",
      variant: "success",
      duration: 5000,
    });
  } catch (e) {
    if (e instanceof FirebaseError && e.code == "auth/invalid-credential") {
      toast({
        title: "E-mail ou senha inválidos, tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    } else {
      toast({
        title: "Algo deu errado, tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }
}

export async function userSignUp(
  email: string,
  password: string,
  confirmPassword: string,
  name: string,
  plan: string
) {
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  const date = addDays(new Date(), 2);

  try {
    if (password == confirmPassword) {
      if (password.length < 6 || confirmPassword.length < 6) {
        toast({
          title: "Sua senha precisa ter mais de 6 dígitos.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(user, {
          displayName: name,
        });

        await setDoc(doc(db, auth.currentUser!.uid, "data"), {
          plano: plan,
          dataDeVencimento: date,
          tiposDeOperacoes: [],
        });

        toast({
          title: "Conta criada com sucesso.",
          variant: "success",
          duration: 5000,
        });
      }
    } else {
      toast({
        title: "As senhas precisam ser iguais.",
        variant: "destructive",
        duration: 5000,
      });
    }
  } catch (e) {
    if (e instanceof FirebaseError && e.code == "auth/email-already-in-use") {
      toast({
        title: "Este e-mail já está em uso.",
        variant: "destructive",
        duration: 5000,
      });
    } else {
      toast({
        title: "Algo deu errado, tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }
}

export async function updateProfilePicture(photo: File) {
  const auth = getAuth(firebaseApp);
  const storage = getStorage();

  try {
    if (photo instanceof File && auth.currentUser) {
      if (photo.type.startsWith("image/")) {
        const photoRef = ref(storage, `fotosDePerfil/${auth.currentUser.uid}`);

        await uploadBytes(photoRef, photo);

        // Obtém o URL do arquivo enviado (verso)
        const photoURL = await getDownloadURL(photoRef);
        updateProfile(auth.currentUser, {
          photoURL: photoURL,
        });

        toast({
          title: "Foto de perfil atualizada com sucesso!",
          variant: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: "Somente imagens são permitidas!",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  } catch (error) {
    toast({
      title: "Algo deu errado, tente novamente!",
      variant: "destructive",
      duration: 5000,
    });
  }
}

export async function userSignOut() {
  const auth = getAuth(firebaseApp);
  await signOut(auth);
  toast({
    title: "Logout efetuado com sucesso.",
    variant: "destructive",
    duration: 5000,
  });
}
