import { trpc } from "../api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Options } from "@/components/ui/options";
import { Loading } from "@/components/ui/loading";
import moment from "moment";
import { Button } from "@/components/ui/button";

export const Posts = () => {
    const [categories, setCategories] = useState<{ id: number }[]>([]);
    const [countries, setCountries] = useState<{ id: number }[]>([]);

    const posts = trpc.posts.getPosts.useInfiniteQuery(
        {
            categories,
            countries,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );

    const filters = trpc.posts.getFilters.useQuery();

    if (posts.isError) {
        return (
            <div>
                <h4>Something went wrong!</h4>
                <h5>Please do not contact developers!</h5>
            </div>
        );
    }

    if (filters.isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex min-h-[calc(100vh-5rem)] w-full max-w-xl flex-1 flex-col gap-4 pt-6">
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
            {posts.isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="flex flex-col gap-4 pb-4">
                        {posts.data?.pages?.map((group) => (
                            <>
                                {group.posts.map((post) => (
                                    <Link to={`/post/${post.id}`} key={post.id}>
                                        <Card key={post.id}>
                                            <CardContent className="flex w-full gap-4 pb-2 pl-0 pr-0 pt-2">
                                                <div className="w-full">
                                                    <p className="pb-2 pl-4 text-sm text-secondary-foreground">
                                                        {post.User.username}
                                                        {", "}
                                                        {moment(
                                                            post.createdAt,
                                                        ).format("DD/MM/YYYY")}
                                                    </p>
                                                    <div className="w-full border-b border-gray-300"></div>
                                                    <h2 className="pl-4 pt-2 text-lg font-semibold">
                                                        {post.title}
                                                    </h2>
                                                    {post.categories.length >
                                                        0 && (
                                                        <p className="pl-4 text-sm text-gray-500">
                                                            Categories:{" "}
                                                            {post.categories.map(
                                                                (category) =>
                                                                    `${category.name} `,
                                                            )}
                                                        </p>
                                                    )}
                                                    {post.countries.length >
                                                        0 && (
                                                        <p className="pl-4 text-sm text-gray-500">
                                                            Countries:{" "}
                                                            {post.countries.map(
                                                                (country) =>
                                                                    `${country.name} `,
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </>
                        ))}
                        {posts.hasNextPage && (
                            <Button
                                onClick={() => {
                                    posts.fetchNextPage();
                                }}
                                className="mx-auto"
                            >
                                Show more
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
