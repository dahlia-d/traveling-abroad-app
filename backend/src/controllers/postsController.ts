import prisma from '../prisma/client';
import { Category, Country } from '@prisma/client';

export const getPosts = async (categories: Category[], countries: Country[]) => {

    const whereCondition: any = {};

    if (categories?.length > 0) {
        console.log(`Categories: ${categories}`);
        whereCondition.categories = {
            some: {
                id: {
                    in: categories.map((category) => category.id),
                },
            },
        };
    }

    if (countries?.length > 0) {
        console.log(`Countries: ${countries}`);
        whereCondition.countries = {
            some: {
                id: {
                    in: countries.map((country) => country.id),
                },
            },
        };
    }

    const posts = await prisma.post.findMany({
        where: whereCondition,
        include: {
            categories: true,
            countries: true
        }
    });

    return posts;
}


export const getUserPosts = async (username: string) => {
    console.log('User posts');
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        }
    });

    if (user) {
        const posts = prisma.post.findMany({
            where: {
                authorId: user.id,
            }
        })

        console.log(posts);
        return posts;
    }
    else {
        console.log('User not found!')
        return null;
    }
};

export const publishPost = async (title: string, content: string, username: string, categories?: Category[], countries?: Country[]) => {
    console.log(title, content);
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        }
    });

    if (user) {
        const newPost = await prisma.post.create({
            data: {
                title: title,
                createdAt: new Date(),
                content: content,
                authorId: user.id,
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
        console.log('Published: ', newPost.title);
        return newPost;
    }
    else {
        console.log('User not found!')
        return null;
    }
};

export const getFilters = async () => {
    const filters: { categories: Category[] | null, countries: Country[] | null } = { categories: null, countries: null };

    filters.categories = await prisma.category.findMany();
    filters.countries = await prisma.country.findMany();

    return filters;
}