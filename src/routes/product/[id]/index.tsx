import { component$, Resource, useContext, useStylesScoped$, useTask$ } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { useEndpoint } from "@builder.io/qwik-city";
import TheImage from "~/components/TheImage";
import type { IProductByCategory } from "~/routes/category/[category]";
import { CartStoreContextName } from "~/routes/layout";
import { MetaName } from "~/types";
import ProductStyle from './style.css?inline';

export interface IProduct extends IProductByCategory { }

export const onGet: RequestHandler<IProduct> = ({ params: { id } }) => {
    const host = import.meta.env.VITE_STORY_HOST;
    return fetch(host + '/products/' + id).then(data => data.json());
};

export default component$(() => {
    useStylesScoped$(ProductStyle);
    const product = useEndpoint<typeof onGet>();
    const cartStore = useContext(CartStoreContextName);

    useTask$(({ track }) => {
        track(cartStore);

    });

    return <Resource
        value={product}
        onResolved={product => {

            return <div class='shadow-md rounded overflow-hidden w-[70vw] h-[70vh] mx-auto p-3 bg-white/25 text-white'>
                <div class='p-3 flex justify-between items-center'>
                    <button onClick$={() => { history.back(); }}>{'← BACK TO HOME'}</button> <p>{'❤️'}</p>
                </div>
                <div class='grid grid-cols-2 h-[80%] rounded overflow-hidden border-t-2 border-solid border-white'>
                    <div class='flex flex-col items-center justify-center relative top-0 left-0 h-full p-2'>
                        <TheImage src={product.images[0]} alt={product.title} className='absolute top-0 left-0 w-full h-full' />
                    </div>
                    <div class='bg-white/20 backdrop-blur flex flex-col justify-around items-start px-14 text-white border-l-2 border-solid border-white'>
                        <h1 class='text-4xl uppercase mt-8'>{product.category.name}</h1>
                        <p>{product.title}</p>
                        <p class='text-3xl my-6'>${product.price}</p>
                        <p class='text-justify'>{product.description}</p>
                        <div class='flex items-center justify-between my-8 w-full'>
                            <button class='border border-solid border-white p-6 rounded disabled:line-through' disabled={!!cartStore[product.id]?.count} onClick$={() => {
                                const { id, price, title } = product;
                                cartStore[id] = { id, price, title, count: 1 };
                            }}>ADD TO CARD</button>
                            <button class='border border-solid border-white p-6 rounded'>WISHLIST</button>
                        </div>
                    </div>
                </div>
                <div class='grid grid-cols-2 mt-3'>
                    <div class='flex items-center justify-center'>
                        {[1, 2, 3].map(id => <input class='mx-1' type="radio" name="photo" key={id} checked={id == 2} role='button' />)}
                    </div>
                </div>
            </div>;
        }}
    />;
});

export const head: DocumentHead<IProduct> = ({ data }) => {
    if (!data?.title) return {};
    return {
        title: data.title,
        meta: [
            { name: MetaName.desc, property: MetaName.desc, content: data.description + '\n, price:' + data.price },
            { name: MetaName.ogImage, property: MetaName.ogImage, content: data.images?.[0] },
            { name: MetaName.ogTitle, property: MetaName.ogTitle, content: data.title },
            { name: MetaName.ogDesc, property: MetaName.ogDesc, content: data.description + '\n, price:' + data.price },
            { name: MetaName.keys, property: MetaName.keys, content: data.title.split(' ').join(', ') + ', ' + data.price },
        ]
    };
};