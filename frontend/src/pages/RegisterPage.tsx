import { useState } from "react";
import { trpc } from "../api";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Error } from "@/components/ui/error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

const formSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must not exceed 30 characters"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character",
        ),
});

export const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const navigate = useNavigate();

    const login = trpc.authenticate.login.useMutation({
        onSuccess: () => {
            navigate("/");
        },
    });

    const register = trpc.register.register.useMutation({
        onSuccess: () => {
            login.mutate({ password: password, username: username });
        },
    });

    const handleRegister = async (values: z.infer<typeof formSchema>) => {
        register.mutate(values);
        setUsername(values.username);
        setPassword(values.password);
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

    if (register.isError && register.error?.data?.code != "CONFLICT") {
        return <Error />;
    }

    return (
        <Form {...form}>
            <form className="form" onSubmit={form.handleSubmit(handleRegister)}>
                <h2 className="text-center text-lg font-bold">Register</h2>
                {register.error?.data?.code === "CONFLICT" && (
                    <h3 className="text-red-500">
                        There is user with that username!
                    </h3>
                )}
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
                                    type={
                                        passwordVisibility ? "text" : "password"
                                    }
                                    placeholder="Password"
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
                    render={() => (
                        <FormItem>
                            <FormControl>
                                <>
                                    <Checkbox
                                        id="password"
                                        className="mt-1"
                                        onClick={showPassword}
                                    />
                                    <label htmlFor="password" className="pl-1">
                                        Show password
                                    </label>
                                </>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit">Register</Button>
            </form>
        </Form>
    );
};
