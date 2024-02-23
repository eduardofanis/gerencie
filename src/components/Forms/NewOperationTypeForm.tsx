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
import { Input } from "../ui/input";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { firebaseApp } from "@/main";
import { getAuth } from "firebase/auth";
import { NewOperationType, RemoveOperationType } from "@/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
          <form
            onSubmit={form.handleSubmit(handleNewOperationType)}
            className="mt-1 grid gap-2"
            id="form"
          >
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: FGTS" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" formTarget="form">
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
            <div className="space-y-1">
              {data.tiposDeOperacoes.map((tipo) => (
                <div
                  key={tipo.name + tipo.color}
                  className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full`}
                      style={{ backgroundColor: tipo.color }}
                    ></div>
                    <div className="font-medium">{tipo.name}</div>
                  </div>
                  <Button
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-red-400"
                    onClick={() => RemoveOperationType(tipo.name, tipo.color)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
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
          <Button>Fechar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
