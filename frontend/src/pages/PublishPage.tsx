import { useState } from "react";
import { trpc } from "../api";
import Filters from "../components/ui/filter";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryFilters, setCategoryFilters] = useState<{ id: number; name: string; }[]>();
  const [countryFilters, setCountryFilters] = useState<{ id: number; name: string; }[]>();

  const publish = trpc.posts.createPost.useMutation();

  const handleSubmit = async () => {
    console.log("Submit");
    console.log(categoryFilters);
    console.log(countryFilters);
    publish.mutate({ title, content, categories: categoryFilters, countries: countryFilters });
  };

  return (
    <form className="form">
      <h1>Publish</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <h1>{categoryFilters && categoryFilters.length > 0 ? categoryFilters[0].name : 'No categories available'}</h1>
      <Filters setCategoryFilters={setCategoryFilters} setCountryFilters={setCountryFilters} />
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
};
