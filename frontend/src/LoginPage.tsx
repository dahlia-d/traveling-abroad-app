import { useState } from "react";
import { trpc } from "./api";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";

const formSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6),
});

export const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const login = trpc.authenticate.login.useMutation();

  const handleLogin = (values: z.infer<typeof formSchema>) => {
    login.mutate(values);
  };

  const showPassword = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div>
      <Form {...form}>
        <form className="form" onSubmit={form.handleSubmit(handleLogin)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
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
                  <Input
                    type={passwordVisibility ? "text" : "password"}
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={() => (
              <FormItem>
                <FormControl>
                  <>
                    <Checkbox id="password" onClick={showPassword} />
                    <label htmlFor="password">Password visibility</label>
                  </>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
};
