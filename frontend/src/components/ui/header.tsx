import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { trpc } from "@/api";

export const Header = () => {
  let user = trpc.authenticate.getUser.useQuery().data;
  const apiCtx = trpc.useUtils();
  const logout = trpc.authenticate.logout.useMutation({
    onSuccess: () => {
      apiCtx.authenticate.getUser.invalidate();
    },
  });

  return (
    <div className="absolute left-0 top-0 flex min-h-20 w-full flex-row items-center justify-between space-x-4 bg-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
      <div className="flex gap-3 pl-3">
        <Link to="/">
          <Button variant={"ghost"}>Home</Button>
        </Link>
        <Link to="/posts">
          <Button variant={"ghost"}>Posts</Button>
        </Link>
        <Link to="/checkpoits/chart">
          <Button variant={"ghost"}>Checkpoints chart</Button>
        </Link>
        <Link to="/checkpoints/real-time">
          <Button variant={"ghost"}>Checkpoint in real time</Button>
        </Link>
      </div>
      <div className="flex gap-3 pr-3">
        {user ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button>Profile</Button>
            </PopoverTrigger>
            <PopoverContent className="mr-3 flex w-auto flex-col items-center gap-3 font-semibold">
              <div>{user.username}</div>
              <Button>
                <Link to="/publish">Publish</Link>
              </Button>
              <Button onClick={() => logout.mutate()}>Logout</Button>
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
