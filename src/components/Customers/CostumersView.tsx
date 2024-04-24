import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SubscriberContext } from "@/contexts/SubscriberContext";
import { firebaseApp } from "@/main";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Timestamp,
  arrayRemove,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { ClipboardCopy, Edit, Trash, X } from "lucide-react";
import React from "react";
import { useSearchParams } from "react-router-dom";
import NewAnexoForm from "../Forms/NewAnexoForm";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";

export type CostumerProps = {
  email: string;
  estadoCivil: string;
  cpf: string;
  rg: string;
  dataDeEmissao: Timestamp;
  localDeEmissao: string;
  nomeDaMae: string;
  banco: string;
  agencia: string;
  numeroDaConta: string;
  digitoDaConta: string;
  chavePix: string;
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
  banco: string;
  id: string;
  parcelas: string;
  createdAt: Timestamp;
  valorLiberado: string;
  cliente: string;
  clienteId: string;
  statusDaOperacao: string;
};

type ClipboardTextProps = {
  children?: string;
  label?: string;
  className?: string;
};

function ClipboardText({ children, label, className }: ClipboardTextProps) {
  function copyToClipboard() {
    if (!children) return;
    navigator.clipboard.writeText(children);
    toast({
      title: `${label} copiado com sucesso!`,
      variant: "success",
      duration: 5000,
    });
  }

  return (
    <div className={className}>
      {label && <h3 className="font-medium">{label}</h3>}
      <div className="flex items-center gap-1">
        {children ? (
          <>
            <p>{children}</p>
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
          </>
        ) : (
          <p>Não definido</p>
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

  function getChavePix() {
    if (!costumer) return;
    const { chavePix } = costumer;
    switch (chavePix) {
      case "Telefone":
        return costumer.telefone.length === 10
          ? costumer.telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
          : costumer.telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      case "E-mail":
        return costumer.email;

      case "Banco":
        return "Dados bancários";
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
            <h1 className="font-bold text-2xl">{costumer.nome}</h1>
            <ClipboardText>{costumer.email}</ClipboardText>
            <div className="mt-4 grid">
              <Tabs defaultValue="dadosPessoais" className="w-full">
                <TabsList className="w-full bg-slate-50">
                  <TabsTrigger value="dadosPessoais" className="w-full">
                    Dados pessoais
                  </TabsTrigger>
                  <TabsTrigger value="documentacao" className="w-full">
                    Documentação
                  </TabsTrigger>
                  <TabsTrigger value="dadosBancarios" className="w-full">
                    Dados bancários
                  </TabsTrigger>
                  <TabsTrigger value="endereco" className="w-full">
                    Endereço
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="dadosPessoais">
                  <h2 className="text-lg font-medium mb-2">Dados pessoais</h2>
                  <div className="grid grid-cols-3 gap-2">
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
                      {costumer.dataDeNascimento &&
                        new Date(
                          costumer.dataDeNascimento.seconds * 1000
                        ).toLocaleDateString("pt-BR")}
                    </ClipboardText>
                    <ClipboardText label="Sexo">{costumer.sexo}</ClipboardText>
                    <ClipboardText label="Estado civil">
                      {costumer.estadoCivil}
                    </ClipboardText>
                    <ClipboardText label="Naturalidade">
                      {costumer.naturalidade}
                    </ClipboardText>
                  </div>
                </TabsContent>
                <TabsContent value="documentacao">
                  <h2 className="text-lg font-medium mb-2">Documentação</h2>
                  <div className="grid grid-cols-3 gap-2">
                    <ClipboardText className="col-span-2" label="Nome da Mãe">
                      {costumer.nomeDaMae}
                    </ClipboardText>
                    <ClipboardText label="RG">
                      {costumer.rg &&
                        costumer.rg.replace(
                          /(\d{2})(\d{3})(\d{3})(\d{1})/,
                          "$1.$2.$3-$4"
                        )}
                    </ClipboardText>
                    <ClipboardText label="CPF">
                      {costumer.cpf &&
                        costumer.cpf.replace(
                          /(\d{3})(\d{3})(\d{3})(\d{2})/,
                          "$1.$2.$3-$4"
                        )}
                    </ClipboardText>
                    <ClipboardText label="Data de emissão">
                      {costumer.dataDeEmissao &&
                        new Date(
                          costumer.dataDeEmissao.seconds * 1000
                        ).toLocaleDateString("pt-BR")}
                    </ClipboardText>
                    <ClipboardText label="Local de emissão">
                      {costumer.localDeEmissao}
                    </ClipboardText>
                  </div>
                </TabsContent>
                <TabsContent value="dadosBancarios">
                  <h2 className="text-lg font-medium mb-2">Dados bancários</h2>
                  <div className="grid grid-cols-4 gap-2">
                    <ClipboardText label="Banco">
                      {costumer.banco}
                    </ClipboardText>
                    <ClipboardText label="Agência">
                      {costumer.agencia}
                    </ClipboardText>
                    <ClipboardText label="Conta">
                      {costumer.numeroDaConta}
                    </ClipboardText>
                    <ClipboardText label="Dígito">
                      {costumer.digitoDaConta}
                    </ClipboardText>
                    <ClipboardText label="Chave PIX" className="col-span-3">
                      {getChavePix()}
                    </ClipboardText>
                  </div>
                </TabsContent>
                <TabsContent value="endereco">
                  <h2 className="text-lg font-medium mb-2">Endereço</h2>
                  <div className="grid grid-cols-3 gap-2">
                    <ClipboardText label="CEP">
                      {costumer.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}
                    </ClipboardText>
                    <ClipboardText className="col-span-2" label="Rua">
                      {costumer.rua}
                    </ClipboardText>
                    <ClipboardText label="Número">
                      {costumer.numeroDaRua}
                    </ClipboardText>
                    <ClipboardText label="Complemento">
                      {costumer.complemento}
                    </ClipboardText>
                    <ClipboardText label="Estado">
                      {costumer.estado}
                    </ClipboardText>
                    <ClipboardText label="Cidade">
                      {costumer.cidade}
                    </ClipboardText>
                    <ClipboardText label="Bairro">
                      {costumer.bairro}
                    </ClipboardText>
                  </div>
                </TabsContent>
              </Tabs>
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
