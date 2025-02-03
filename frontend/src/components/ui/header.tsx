import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { trpc } from "@/api";

export const Header = () => {
    const navigate = useNavigate();
    let user = trpc.authenticate.getUser.useQuery().data;
    console.log(user);
    const apiCtx = trpc.useUtils();
    const logout = trpc.authenticate.logout.useMutation({
        onSuccess: () => {
            apiCtx.authenticate.getUser.invalidate();
        },
    });

    return (
        <div className="absolute left-0 top-0 flex min-h-20 w-full flex-row items-center justify-between space-x-4 bg-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
            <div className="flex gap-3 pl-3">
                <Button variant={"ghost"}>
                    <Link to="/">Home</Link>
                </Button>
                <Button variant={"ghost"}>
                    <Link to="/posts">Posts</Link>
                </Button>
                <Button variant={"ghost"}>
                    <Link to="/checkpoits/chart">Checkpoints chart</Link>
                </Button>
                <Button variant={"ghost"}>
                    <Link to="/checkpoints/real-time">
                        Checkpoint in real time
                    </Link>
                </Button>
            </div>
            <div className="flex gap-3 pr-3">
                {user ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button>Profile</Button>
                        </PopoverTrigger>
                        <PopoverContent className="flex w-auto flex-col items-center gap-3">
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
                        <Button onClick={() => navigate("/login")}>
                            Login
                        </Button>
                        <Button onClick={() => navigate("/register")}>
                            Register
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};
