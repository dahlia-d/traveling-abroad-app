import { Link, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerFooter,
    DrawerClose,
    DrawerTitle,
    DrawerDescription,
} from "./drawer";
import { trpc } from "@/api";
import { MenuIcon } from "lucide-react";

export const Header = () => {
    const location = useLocation();
    let user = trpc.authenticate.getUser.useQuery().data;
    const apiCtx = trpc.useUtils();
    const logout = trpc.authenticate.logout.useMutation({
        onSuccess: () => {
            apiCtx.authenticate.getUser.invalidate();
        },
    });

    const getVariant = (path: string) =>
        location.pathname === path ? "secondary" : "ghost";

    return (
        <div className="absolute left-0 top-0 flex min-h-20 w-full flex-row items-center justify-between space-x-4 bg-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
            <div className="md:hidden">
                <Drawer direction="left">
                    <DrawerTrigger asChild className="ml-3">
                        <MenuIcon />
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="ml-2 mr-2 flex flex-col gap-2">
                            <DrawerTitle className="mx-auto my-3">
                                Menu
                            </DrawerTitle>
                            <DrawerDescription className="sr-only">
                                Mobile navigation drawer
                            </DrawerDescription>
                            <DrawerClose asChild>
                                <Link to="/">
                                    <Button
                                        variant={getVariant("/")}
                                        className="w-full justify-start"
                                    >
                                        Home
                                    </Button>
                                </Link>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Link to="/posts">
                                    <Button
                                        variant={getVariant("/posts")}
                                        className="w-full justify-start"
                                    >
                                        Posts
                                    </Button>
                                </Link>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Link to="/checkpoits/chart">
                                    <Button
                                        variant={getVariant(
                                            "/checkpoits/chart",
                                        )}
                                        className="w-full justify-start"
                                    >
                                        Border checkpoints chart
                                    </Button>
                                </Link>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Link to="/checkpoints/real-time">
                                    <Button
                                        variant={getVariant(
                                            "/checkpoints/real-time",
                                        )}
                                        className="w-full justify-start"
                                    >
                                        Border checkpoints in real time
                                    </Button>
                                </Link>
                            </DrawerClose>
                        </div>
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
            <div className="hidden gap-3 pl-3 md:flex">
                <Link to="/">
                    <Button variant={getVariant("/")}>Home</Button>
                </Link>
                <Link to="/posts">
                    <Button variant={getVariant("/posts")}>Posts</Button>
                </Link>
                <Link to="/checkpoits/chart">
                    <Button variant={getVariant("/checkpoits/chart")}>
                        Border checkpoints chart
                    </Button>
                </Link>
                <Link to="/checkpoints/real-time">
                    <Button variant={getVariant("/checkpoints/real-time")}>
                        Border checkpoints in real time
                    </Button>
                </Link>
            </div>
            <div className="flex gap-3 pr-3">
                {user ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button>{user.username}</Button>
                        </PopoverTrigger>
                        <PopoverContent className="mr-3 flex w-auto flex-col items-center gap-3 font-semibold">
                            <div>{user.username}</div>
                            <Button>
                                <Link to="/publish">Publish</Link>
                            </Button>
                            <Button onClick={() => logout.mutate()}>
                                Logout
                            </Button>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <>
                        <Link to="/login">
                            <Button>Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button>Register</Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};
