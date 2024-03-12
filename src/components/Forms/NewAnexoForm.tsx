import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import React from "react";
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { firebaseApp } from "@/main";
import { SubscriberContext } from "@/contexts/SubscriberContext";
import { useSearchParams } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { toast } from "../ui/use-toast";

const acceptedExtensions = ["pdf", "png", "jpg", "jpeg", "webp"];

export default function NewAnexoForm() {
  const [fileList, setFileList] = React.useState<File[]>([]);
  const [searchParams] = useSearchParams();
  const { subscriber } = React.useContext(SubscriberContext);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || !fileList) return;
    if (
      acceptedExtensions.indexOf(event.target.files[0].name.split(".")[1]) < 0
    ) {
      toast({
        title: "Extensão inválida",
        description: "Por favor, envie arquivos PDF, PNG, JPG, JPEG ou WEBP.",
        variant: "destructive",
      });
      return;
    }
    const novosArquivos = Array.from(event.target.files);
    setFileList([...fileList, ...novosArquivos]);
  }

  function handleRemoveFile(index: number) {
    const novosArquivos = [...fileList];
    novosArquivos.splice(index, 1);
    setFileList(novosArquivos);
  }

  async function handleUpload() {
    if (fileList.length > 0) {
      const db = getFirestore(firebaseApp);
      const storage = getStorage();

      const clienteId = searchParams.get("visualizarCliente");

      if (subscriber && clienteId) {
        try {
          const docRef = doc(db, subscriber.id, "data", "clientes", clienteId);

          fileList.forEach(async (file) => {
            const fileRef = ref(
              storage,
              `documentos/${clienteId}-${file.name}`
            );

            await uploadBytes(fileRef, file);
            const fileURL = await getDownloadURL(fileRef);
            updateDoc(docRef, {
              anexos: arrayUnion({
                name: file.name,
                url: fileURL,
              }),
            });
          });

          toast({
            title: "Arquivo(s) anexado(s) com sucesso!",
            variant: "success",
            duration: 5000,
          });
        } catch (error) {
          toast({
            title: "Erro ao anexar arquivo.",
            description: "Por favor, tente novamente.",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    }
  }

  return (
    <DialogContent className="flex flex-col">
      <DialogHeader>
        <DialogTitle>Anexar arquivos</DialogTitle>
        <DialogDescription>
          Selecione os arquivos que deseja anexar.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <Input
          type="file"
          value=""
          onChange={(e) => handleFileChange(e)}
          accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf"
          className="w-full"
        />

        {!fileList || fileList.length <= 0 ? (
          <span className="text-sm font-medium">
            Nenhum arquivo selecionado.
          </span>
        ) : (
          <ul className="list-decimal list text-sm space-y-1">
            {fileList &&
              Array.from(fileList).map((file, index) => (
                <li className="flex gap-2 items-center" key={index}>
                  <Button
                    variant="link"
                    className="size-4 p-0"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="size-4 text-red-700" />
                  </Button>
                  <TooltipProvider key={file.name}>
                    <Tooltip>
                      <TooltipTrigger asChild className="">
                        <span className="flex justify-between hover:underline hover:cursor-default">
                          {file.name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {file.type.includes("image") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="max-h-[300px] w-auto"
                          />
                        ) : (
                          <p>{file.name}</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
          </ul>
        )}
      </div>

      <DialogFooter className="mt-8 col-span-2">
        <DialogClose asChild>
          <Button
            type="button"
            className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
            variant={"outline"}
          >
            Cancelar
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <Button type="submit" onClick={handleUpload}>
            Anexar
          </Button>
        </DialogClose>
      </DialogFooter>
      <DialogClose className="absolute top-4 right-4">
        <X className="h-4 w-4" />
      </DialogClose>
    </DialogContent>
  );
}
