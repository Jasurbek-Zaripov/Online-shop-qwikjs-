import { component$, Resource } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { useEndpoint } from "@builder.io/qwik-city";
import TheShowImage from "~/components/TheShowImage";
import { MetaName } from "~/types";

export interface IProductByCategory {
    id: number,
    title: string,
    price: number,
    description: string,
    images: string[],
    creationAt: string,
    updatedAt: string,
    category: {
        id: number,
        name: string,
        image: string,
        creationAt: string,
        updatedAt: string;
    };
}

export const onGet: RequestHandler<IProductByCategory[] | null> = ({ params: { category } }) => {
    const host = import.meta.env.VITE_STORY_HOST;
    return fetch(host + `/categories/${category}/products?limit=20&offset=0`, {})
        .then(data => data.json())
        .then((data: IProductByCategory[]) => data.filter(({ id, title, images: [image], price, category: { name } }) => {
            return { id, title, images: [image], price, category: { name } };
        }))
        .catch(err => err);
};

export default component$(() => {
    const products = useEndpoint<typeof onGet>();

    return <Resource
        value={products}
        onRejected={err => <div class='text-9xl text-center text-red-500'>{err}</div>}
        onResolved={products => {
            return <>
                {
                    products?.length ?
                        <div class="gap-2 grid grid-cols-3">
                            {products.map((product) =>
                                <a href={'/product/' + product.id} key={product.id + ':' + product.price}>
                                    <TheShowImage image={product.images[0]} title={product.title} >
                                        <p class='mt-3 text-4xl text-gr bg-gradient-to-tr from-red-400 to-yellow-400'>${product.price}</p>
                                    </TheShowImage>
                                </a>)}
                        </div> : <div class='flex flex-col items-center justify-center'>
                            <div class='text-9xl text-yellow-500'>NOT FOUND!</div>
                            <a href="/" class='p-5 shadow rounded bg-black/25 mt-4'>{'Home'}</a>
                        </div>
                }
            </>;

        }} />;
});

export const head: DocumentHead<IProductByCategory[]> = ({ data }) => {
    if (!data?.length) return {};
    const name = data[0]?.category?.name?.toUpperCase();
    const image = data[0]?.images?.[0];
    return {
        title: name,
        meta: [
            { name: MetaName.desc, property: MetaName.desc, content: name },
            { name: MetaName.keys, property: MetaName.keys, content: name },
            { name: MetaName.ogDesc, property: MetaName.ogDesc, content: name },
            { name: MetaName.ogImage, property: MetaName.ogImage, content: image },
            { name: MetaName.ogTitle, property: MetaName.ogTitle, content: name },

        ]
    };
};