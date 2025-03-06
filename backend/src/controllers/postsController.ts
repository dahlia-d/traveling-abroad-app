import prisma from '../prisma/client';
import { Category, Country } from '@prisma/client';

export const getPosts = async (categories: { id: number }[], countries: { id: number }[], cursor: number | undefined | null) => {

    const whereCondition: any = {};

    if (categories?.length > 0) {
        whereCondition.categories = {
            some: {
                id: {
                    in: categories.map((category) => category.id),
                },
            },
        };
    }

    if (countries?.length > 0) {
        whereCondition.countries = {
            some: {
                id: {
                    in: countries.map((country) => country.id),
                },
            },
        };
    }

    const posts = await prisma.post.findMany({
        take: 6,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        where: whereCondition,
        include: {
            categories: true,
            countries: true,
            User: true
        }
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (posts.length > 5) {
        const nextPost = posts.pop();
        nextCursor = nextPost!.id;
    }

    return { posts, nextCursor };
}


export const getUserPosts = async (userId: number) => {

    const posts = prisma.post.findMany({
        where: {
            authorId: userId,
        }
    })

    return posts;
};

export const publishPost = async (title: string, content: string, userId: number, categories?: { id: number }[], countries?: { id: number }[]) => {
    const newPost = await prisma.post.create({
        data: {
            title: title,
            createdAt: new Date(),
            content: content,
            authorId: userId,
            categories: {
                connect: categories?.map((category) => ({ id: category.id }))
            },
            countries: {
                connect: countries?.map((country) => ({ id: country.id }))
            }
        },
        include: {
            categories: true,
            countries: true
        }
    });
    return newPost;
};

export const getPost = async (id: number) => {
    const post = await prisma.post.findUnique({
        where: {
            id: id
        },
        include: {
            User: true
        }
    })

    return post;
}

export const getFilters = async () => {
    const filters: { categories: Category[] | null, countries: Country[] | null } = { categories: null, countries: null };

    filters.categories = await prisma.category.findMany();
    filters.countries = await prisma.country.findMany();

    return filters;
}