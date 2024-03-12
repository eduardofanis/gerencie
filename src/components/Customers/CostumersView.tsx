import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import React from "react";
import {
  Timestamp,
  arrayRemove,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { ClipboardCopy, Edit, Trash, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "../ui/use-toast";
import { DialogTrigger } from "@radix-ui/react-dialog";
import NewAnexoForm from "../Forms/NewAnexoForm";
import { firebaseApp } from "@/main";
import { SubscriberContext } from "@/contexts/SubscriberContext";
import { deleteObject, getStorage, ref } from "firebase/storage";

export type CostumerProps = {
  estadoCivil: string;
  cpfRg: string;
  id: string;
  bairro: string;
  estado: string;
  telefone: string;
  complemento: string;
  sexo: string;
  naturalidade: string;
  dataDeNascimento: Timestamp;
  nome: string;
  cidade: string;
  numeroDaRua: string;
  cep: string;
  rua: string;
  createdAt: Timestamp;
  anexos: {
    url: string;
    name: string;
  }[];
};

export type OperationProps = {
  dataDaOperacao: Timestamp;
  comissao: string;
  valorRecebido: string;
  tipoDaOperacao: string;
  id: string;
  parcelas: string;
  createdAt: Timestamp;
  valorLiberado: string;
  cliente: string;
  clienteId: string;
  statusDaOperacao: string;
};

type ClipboardTextProps = {
  children: string;
  label: string;
  clipboard?: boolean;
  className?: string;
};

function ClipboardText({
  children,
  label,
  clipboard = true,
  className,
}: ClipboardTextProps) {
  function copyToClipboard() {
    navigator.clipboard.writeText(children);
    toast({
      title: `${label} copiado com sucesso!`,
      variant: "success",
      duration: 5000,
    });
  }

  return (
    <div className={className}>
      <h3 className="font-medium">{label}</h3>
      <div className="flex items-center gap-1">
        <p>{children}</p>
        {clipboard && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={copyToClipboard}>
                <ClipboardCopy className="h-4 w-4 " />
              </TooltipTrigger>
              <TooltipContent>
                <p>Clique para copiar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

export default function CostumersView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [costumer, setCostumer] = React.useState<CostumerProps>();
  const { subscriber } = React.useContext(SubscriberContext);

  const isOpen = searchParams.get("visualizarCliente") ? true : false;
  const id: string = searchParams.get("visualizarCliente")!;

  React.useEffect(() => {
    const db = getFirestore(firebaseApp);
    if (id) {
      const unsubscribe = onSnapshot(
        doc(db, subscriber!.id, "data", "clientes", id),
        (querySnapshot) => {
          const costumer = querySnapshot.data() as CostumerProps;
          setCostumer(costumer);
        }
      );
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [searchParams, subscriber, id]);

  async function handleRemoveAnexo(name: string, url: string) {
    const db = getFirestore(firebaseApp);
    const storage = getStorage();
    try {
      const fileRef = ref(storage, `documentos/${id}-${name}`);
      await deleteObject(fileRef);

      await updateDoc(doc(db, subscriber!.id, "data", "clientes", id), {
        anexos: arrayRemove({
          name: name,
          url: url,
        }),
      });
      toast({
        title: "Anexo removido com sucesso!",
        variant: "success",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Algo deu errado, tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }

  if (!costumer)
    return (
      <Dialog open={isOpen}>
        <DialogContent className="max-w-[600px]">
          <Skeleton className="w-full h-[400px]" />
        </DialogContent>
      </Dialog>
    );
  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-[600px]">
        <div className="grid gap-8">
          <div className="">
            <h1 className="font-bold text-2xl mb-4">{costumer.nome}</h1>
            <div>
              <h2 className="text-lg font-medium mb-2">Dados pessoais</h2>
              <div className="grid grid-cols-3 gap-2">
                <ClipboardText label="CPF/RG">
                  {costumer.cpfRg.length === 11
                    ? costumer.cpfRg.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4"
                      )
                    : costumer.cpfRg.length === 9
                    ? costumer.cpfRg.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{1})/,
                        "$1.$2.$3-$4"
                      )
                    : costumer.cpfRg}
                </ClipboardText>
                <ClipboardText label="Telefone">
                  {costumer.telefone.length === 10
                    ? costumer.telefone.replace(
                        /(\d{2})(\d{4})(\d{4})/,
                        "($1) $2-$3"
                      )
                    : costumer.telefone.replace(
                        /(\d{2})(\d{5})(\d{4})/,
                        "($1) $2-$3"
                      )}
                </ClipboardText>
                <ClipboardText label="Data de nascimento">
                  {new Date(
                    costumer.dataDeNascimento.seconds * 1000
                  ).toLocaleDateString("pt-BR")}
                </ClipboardText>
                <ClipboardText
                  clipboard={costumer.sexo ? true : false}
                  label="Sexo"
                >
                  {costumer.sexo ? costumer.sexo : "Não definido"}
                </ClipboardText>
                <ClipboardText
                  clipboard={!!costumer.estadoCivil}
                  label="Estado civil"
                >
                  {costumer.estadoCivil ? costumer.estadoCivil : "Não definido"}
                </ClipboardText>
                <ClipboardText
                  clipboard={!!costumer.naturalidade}
                  label="Naturalidade"
                >
                  {costumer.naturalidade
                    ? costumer.naturalidade
                    : "Não definido"}
                </ClipboardText>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-medium mb-2">Endereço</h2>
              <div className="grid grid-cols-3 gap-2">
                <ClipboardText label="CEP">
                  {costumer.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}
                </ClipboardText>
                <ClipboardText className="col-span-2" label="Rua">
                  {costumer.rua}
                </ClipboardText>
                <ClipboardText
                  clipboard={!!costumer.numeroDaRua}
                  label="Número"
                >
                  {costumer.numeroDaRua ? costumer.numeroDaRua : "Não definido"}
                </ClipboardText>
                <ClipboardText
                  clipboard={!!costumer.complemento}
                  label="Complemento"
                >
                  {costumer.complemento ? costumer.complemento : "Não definido"}
                </ClipboardText>
                <ClipboardText clipboard={!!costumer.estado} label="Estado">
                  {costumer.estado ? costumer.estado : "Não definido"}
                </ClipboardText>
                <ClipboardText clipboard={!!costumer.cidade} label="Cidade">
                  {costumer.cidade ? costumer.cidade : "Não definido"}
                </ClipboardText>
                <ClipboardText clipboard={!!costumer.bairro} label="Bairro">
                  {costumer.bairro ? costumer.bairro : "Não definido"}
                </ClipboardText>
              </div>
            </div>
            <div className="flex flex-col truncate text-ellipsis mt-4">
              <h3 className="font-medium text-lg mb-2">Anexos</h3>
              <ul className="flex list-decimal list-inside text-sm flex-col gap-1 text-ellipsis truncate">
                {costumer.anexos &&
                  costumer.anexos.length > 0 &&
                  costumer.anexos.map((anexo, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild className="text-left w-fit">
                            <a
                              href={anexo.url}
                              target="_blank"
                              className="hover:underline opacity-90"
                            >
                              {anexo.name}
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            {anexo.name.endsWith(".pdf") ? (
                              <iframe
                                src={anexo.url}
                                className="h-[300px] w-auto object-fit"
                              />
                            ) : (
                              <img
                                src={anexo.url}
                                alt={anexo.name}
                                className="h-[300px] w-auto"
                              />
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        variant="ghost"
                        className="size-6 p-0"
                        onClick={() => handleRemoveAnexo(anexo.name, anexo.url)}
                      >
                        <Trash className="size-4 text-red-700" />
                      </Button>
                    </li>
                  ))}
              </ul>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-fit p-0 m-0 h-6 mt-1" variant={"link"}>
                    Clique para anexar um arquivo
                  </Button>
                </DialogTrigger>
                <NewAnexoForm />
              </Dialog>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => {
              setSearchParams({
                editarCliente: costumer.id.split("-").slice(1).join("-"),
              });
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar cliente
          </Button>
          <Button onClick={() => setSearchParams({})}>Fechar</Button>
        </DialogFooter>
        <DialogClose
          className="absolute top-4 right-4"
          onClick={() => setSearchParams({})}
        >
          <X className="h-4 w-4" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
