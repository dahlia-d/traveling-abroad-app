import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./api";
import { httpBatchLink } from "@trpc/client";
import { HomePage } from "./pages/HomePage";
import { Publish } from "./pages/PublishPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/LoginPage";
import { Register } from "./pages/RegisterPage";
import { Posts } from "./pages/PostsPage";
import { PostDetails } from "./pages/PostDetailsPage";
import { RefreshToken } from "./refreshTokenComponent";

function App() {

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:5000/trpc",
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
          <RefreshToken />
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/publish" element={<Publish />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/post/:id" element={<PostDetails />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}

export default App;
