import { useState } from "react";
import { trpc } from "./api";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const register = trpc.register.register.useMutation();

  const handleLogin = async () => {
    register.mutate({ username, password });
  };

  const showPassword = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <form className="form">
      <input
        type="text"
        placeholder="Username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type={passwordVisibility ? "text" : "password"}
        placeholder="Password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input id="passwordCheckbox" type="checkbox" onClick={showPassword} />
      <label>{passwordVisibility ? "Hide" : "Show"}</label>
      <br />
      <button onClick={handleLogin}>Login</button>
    </form>
  );
};
