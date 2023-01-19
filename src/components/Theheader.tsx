import { component$, Resource, useContext, useResource$, useStylesScoped$ } from "@builder.io/qwik";
import { ShowCartContextName } from "~/routes/layout";
import HeaderStyle from './TheHeader.css?inline';

export interface IHeaderProp { id: number, name: string; };

export default component$(() => {
    useStylesScoped$(HeaderStyle);
    const categories = useResource$<IHeaderProp[]>(async () => {
        const host = import.meta.env.VITE_STORY_HOST;
        const data = await fetch(host + '/categories');
        const data_1 = await data.json() as IHeaderProp[];
        return data_1.filter(({ id, name }) => ({ id, name }));
    });

    const showCartStore = useContext(ShowCartContextName);

    return <Resource
        value={categories}
        onResolved={data => {
            return <header class='bg-black/30 backdrop-blur-lg shadow-lg h-20 mb-5 sticky top-0 left-0 z-30 flex items-center justify-between px-5'>
                <div>
                    <p>ONLINE SHOP</p>
                </div>
                <div>
                    <a href="/">
                        <p class='animate-bounce transition-all rounded shadow p-2 shadow-white/50'>CATEGORIES</p>
                    </a>
                </div>
                <div class='flex items-center justify-center'>
                    {data?.map(category =>
                        <a href={'/category/' + category.id}>
                            <p class='mx-1 rounded p-3 border border-solid border-white/40 hover:text-opacity-100 duration-300' key={category.id + ':' + category.name}>
                                {category.name}
                            </p>
                        </a>
                    )}
                </div>
                <div class='flex items-center justify-center gap-8'>
                    <p role='button' class='shadow shadow-white/40 rounded p-3' onClick$={() => showCartStore.show = true}>CART</p>
                    <div class='flex items-center justify-center gap-3'>
                        <p role="button" class='shadow shadow-white/40 rounded p-3'>Log in</p>
                        <p role="button" class='shadow shadow-white/40 rounded p-3'>Sign in</p>
                    </div>
                </div>
            </header>;
        }}
    />;
});