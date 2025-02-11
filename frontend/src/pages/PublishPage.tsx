import { useState } from "react";
import { trpc } from "../api";
import { Options } from "@/components/ui/options";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<{ id: number }[]>([]);
  const [countries, setCountries] = useState<{ id: number }[]>([]);
  const navigate = useNavigate();

  const filters = trpc.posts.getFilters.useQuery();

  const publish = trpc.posts.createPost.useMutation({
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    publish.mutate({
      title,
      content,
      categories: categories,
      countries: countries,
    });
  };

  if (publish.isError) {
    return (
      <>
        <div>The post wasn't created! {publish.error.message}</div>
      </>
    );
  }

  return (
    <form className="m-10 flex w-screen min-w-96 flex-col gap-3 rounded-sm border-2 border-black bg-white p-10 drop-shadow">
      <h1 className="text-center text-lg font-bold">Publish</h1>
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        rows={5}
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex place-items-center items-center justify-center gap-3">
        <Options
          options={filters.data?.countries ?? []}
          setOptions={setCountries}
        />
        <Options
          options={filters.data?.categories ?? []}
          setOptions={setCategories}
        />
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
    </form>
  );
};
