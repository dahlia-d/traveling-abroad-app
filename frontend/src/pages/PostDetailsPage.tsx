import { trpc } from "@/api";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const PostDetails = () => {
    const { id } = useParams();

    let post = id
        ? trpc.posts.getPost.useQuery({ postId: parseInt(id) }).data
        : null;

    if (!post) {
        return <text>Post not found!</text>;
    }

    return (
        <div className="flex min-h-[calc(100vh-5rem)] w-96 flex-col border-secondary pt-6 text-black">
            <Card>
                <CardContent className="p-4">
                    <h1 className="pb-0 text-3xl font-semibold">
                        {post.title}
                    </h1>
                    <p className="text-gray-600">
                        By {post.User.username} on{" "}
                        {moment(post.createdAt).format("DD/MM/YYYY")}
                    </p>
                    <p className="mt-4 text-lg leading-relaxed text-gray-800">
                        {post.content}
                    </p>
                </CardContent>
            </Card>
            <div className="mt-6 flex justify-between">
                <Link to="/posts">
                    <Button variant="outline">Back to Posts</Button>
                </Link>
            </div>
        </div>
    );
};
