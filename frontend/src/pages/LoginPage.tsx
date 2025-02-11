import { useState } from "react";
import { trpc } from "../api";
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
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Error } from "@/components/ui/error";
import { Loading } from "@/components/ui/loading";

const formSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6),
});

export const Login = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const navigate = useNavigate();
    const apiCtx = trpc.useUtils();
    const login = trpc.authenticate.login.useMutation({
        onSuccess: () => {
            apiCtx.authenticate.getUser.invalidate();
            navigate("/");
        },
    });
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
    if (login.isError && login.error?.data?.code != "UNAUTHORIZED") {
        return <Error />;
    }
    if (login.isPending) {
        return <Loading />;
    }
    return (
        <Form {...form}>
            <form className="form" onSubmit={form.handleSubmit(handleLogin)}>
                <h2 className="text-center text-lg font-bold">Login</h2>
                {login.error?.data?.code === "UNAUTHORIZED" && (
                    <h3 className="text-red-500">{login.error?.message}</h3>
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
                <Button type="submit">Login</Button>
            </form>
        </Form>
    );
};
