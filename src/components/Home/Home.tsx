import { z } from "zod";
import Sidebar from "../Sidebar/Sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Home() {
  const testeSchema = z.object({
    image: z.instanceof(FileList).transform((files) => files.item(0)),
  });

  const testeForm = useForm<z.infer<typeof testeSchema>>({
    resolver: zodResolver(testeSchema),
  });

  function onSubmit(values: z.infer<typeof testeSchema>) {
    console.log(values);
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <Form {...testeForm}>
          <form onSubmit={testeForm.handleSubmit(onSubmit)}>
            <Label htmlFor="image">Teste</Label>
            <Input id="image" type="file" {...testeForm.register("image")} />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
