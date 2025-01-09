import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./api";
import { httpBatchLink } from "@trpc/client";
import { HomePage } from "./HomePage";
import { Publish } from "./PublishPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./LoginPage";
import { Register } from "./RegisterPage";

function App() {
  const [count, setCount] = useState(0);

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:5000/trpc",
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    }),
  );

  return (
    <>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/publish" element={<Publish />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}

export default App;
