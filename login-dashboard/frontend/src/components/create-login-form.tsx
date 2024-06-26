"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "./ui/toaster"
import { api } from "@/service/api"

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type LoginSchema = z.infer<typeof loginSchema>

export function CreateLoginForm(props: any) {

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  })

  async function onSubmit(data: LoginSchema) {
    if (!data.email) return;

    const isUser = await api.post("/iscustomer", {
      email: data.email
    });

    
    if (!isUser.data)
    {
      toast({
        title: "Invalid user data",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(isUser, null, 2)}
            </code>
          </pre>
        ),
      });
    }

    else {
      const canLogin = await api.post("/canlogin", {
        email: data.email,
        password: data.password
      })

      if (!canLogin.data)
      {
        toast({
          title: "Invalid user data",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(canLogin, null, 2)}
              </code>
            </pre>
          ),
        });
      }

      else {
        toast({
          title: "Logged in as " + JSON.stringify(canLogin.data.name, null, 2),
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(canLogin.data, null, 2)}
              </code>
            </pre>
          ),
        });
      }

    }

    /*toast({
      title: "Form submitted:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });*/
  }

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="blablabha@gmail.com"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="submit">Submit</Button>
          <Button variant="link" type="button" {...props}>Don't have a account? Register</Button>
        </div>
      </form>
    </Form>
  );
}