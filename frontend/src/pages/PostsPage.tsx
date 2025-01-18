import { trpc } from '../api';
import { useState } from 'react';
import Filters from '../components/ui/filter';
import { Link } from 'react-router-dom';

export const Posts = () => {

    const [categories, setCategoryFilters] = useState<{ id: number, name: string }[]>([]);
    const [countries, setCountryFilters] = useState<{ id: number, name: string }[]>([]);

    const posts = trpc.posts.getPosts.useQuery({ categories, countries }).data;

    const postsComponents = posts?.map((post) => {
        return (
            <Link to={`/post/${post.id}`}>
                <div className="post">
                    <div className="flex flex-row justify-start w-full border-b-2">
                        <h6>{post.User.username}, </h6>
                        <h6>{post.createdAt}</h6>
                    </div>
                    <h5>{post.title}</h5>
                </div>
            </Link>
        )
    })

    return (
        <>
            <Filters setCategoryFilters={setCategoryFilters} setCountryFilters={setCountryFilters} />
            {postsComponents}
        </>
    );
}