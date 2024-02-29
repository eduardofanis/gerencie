import { PlusCircle, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { firebaseApp } from "@/main";
import { getAuth } from "firebase/auth";
import { NewOperationType, RemoveOperationType } from "@/services/api";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextInput from "./Input/TextInput";
import ColorInput from "./Input/ColorInput";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export type OperationType = {
  name: string;
  color: string;
};

export type UserDataProps = {
  tiposDeOperacoes: OperationType[];
};

const FormSchema = z.object({
  name: z.string().min(1),
  color: z.string(),
});

export default function NewOperationTypeForm() {
  const [data, setData] = React.useState<UserDataProps | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      color: "#000000",
    },
  });

  React.useEffect(() => {
    const db = getFirestore(firebaseApp);
    const { currentUser } = getAuth(firebaseApp);

    const unsubscribe = onSnapshot(
      doc(db, currentUser!.uid, "data"),
      (docSnapshot) => {
        setData(docSnapshot.data() as UserDataProps);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  function handleNewOperationType({ name, color }: OperationType) {
    NewOperationType(name, color);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar ou remover</DialogTitle>
        <DialogDescription>
          Selecione a cor e preencha o nome para adicionar ou selecione um tipo
          para remover.
        </DialogDescription>
      </DialogHeader>
      <div>
        <Form {...form}>
          <form className="mt-1 grid gap-2" id="form">
            <ColorInput form={form} name="color" label="Cor" />
            <TextInput
              form={form}
              name="name"
              placeholder="Ex: FGTS"
              label="Nome"
            />

            <Button
              type="button"
              formTarget="form"
              onClick={form.handleSubmit(handleNewOperationType)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Clique para Adicionar
            </Button>
          </form>
        </Form>
      </div>

      {data && data.tiposDeOperacoes && data.tiposDeOperacoes.length > 0 ? (
        <>
          <Separator className="my-2" />

          <ScrollArea className="h-[140px] border rounded-lg p-2">
            <div className="divide-y">
              {data.tiposDeOperacoes.map((tipo) => (
                <div
                  key={`${tipo.color}-${tipo.name}`}
                  className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full`}
                      style={{ backgroundColor: tipo.color }}
                    ></div>
                    <div className="font-medium">{tipo.name}</div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        type="button"
                        className="h-6 w-6 p-0 hover:bg-red-400"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmação</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ao remover um Tipo de Operação,{" "}
                          <span className="font-semibold text-red-600">
                            todas as operações que possuem esse tipo serão
                            apagadas
                          </span>
                          . Deseja continuar?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {}}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() =>
                              RemoveOperationType(tipo.name, tipo.color)
                            }
                          >
                            Remover
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      ) : (
        <></>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"secondary"} type="button">
            Fechar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
