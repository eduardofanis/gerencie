import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { GetCostumer } from "@/services/api";
import React from "react";
import { Timestamp } from "firebase/firestore";
import { ClipboardCopy, Edit } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "../ui/use-toast";

export type CostumerProps = {
  estadoCivil: string;
  cpf: string;
  id: string;
  bairro: string;
  estado: string;
  frenteDoDocumento: string;
  telefone: string;
  complemento: string;
  sexo: string;
  tipoDoDocumento: string;
  naturalidade: string;
  dataDeNascimento: Timestamp;
  nome: string;
  cidade: string;
  versoDoDocumento: string;
  numeroDaRua: string;
  cep: string;
  rua: string;
  createdAt: Timestamp;
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

  const isOpen = searchParams.get("visualizarCliente") ? true : false;

  React.useEffect(() => {
    async function getCostumer() {
      const id: string = searchParams.get("visualizarCliente")!;
      if (searchParams.get("visualizarCliente")) {
        const costumerData = await GetCostumer(id);
        setCostumer(costumerData);
      }
    }
    getCostumer();
  }, [searchParams]);

  if (!costumer)
    return (
      <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="grid grid-cols-3">
            <div className="grid gap-3">
              <Skeleton className="h-[280px]"></Skeleton>
              <Skeleton className="h-[280px]"></Skeleton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <div className="grid grid-cols-[200px_1fr] gap-8">
          <div className="grid gap-3">
            {costumer.frenteDoDocumento ? (
              <div className="">
                <img
                  src={costumer.frenteDoDocumento}
                  className="h-[260px] object-cover rounded"
                />
              </div>
            ) : (
              <Skeleton className="h-[260px]"></Skeleton>
            )}

            {costumer.versoDoDocumento ? (
              <div className="">
                <img
                  src={costumer.versoDoDocumento}
                  className="h-[260px] object-cover rounded"
                />
              </div>
            ) : (
              <Skeleton className="h-[260px]"></Skeleton>
            )}
          </div>
          <div className="">
            <h1 className="font-bold text-2xl mb-8">{costumer.nome}</h1>
            <div>
              <h2 className="text-lg font-medium mb-4">Dados pessoais</h2>
              <div className="grid grid-cols-3 gap-2">
                <ClipboardText label="CPF/RG">
                  {costumer.cpf.length === 11
                    ? costumer.cpf.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4"
                      )
                    : costumer.cpf.length === 9
                    ? costumer.cpf.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{1})/,
                        "$1.$2.$3-$4"
                      )
                    : costumer.cpf}
                </ClipboardText>
                <ClipboardText label="Telefone">
                  {costumer.telefone.replace(
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
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Endereço</h2>
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
            <div className="mt-8">
              <ClipboardText label="Tipo de documento" clipboard={false}>
                {costumer.tipoDoDocumento
                  ? costumer.tipoDoDocumento
                  : "Não definido"}
              </ClipboardText>
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
      </DialogContent>
    </Dialog>
  );
}
