import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { CartStoreContextName, ShowCartContextName } from "~/routes/layout";

export default component$(() => {
    const showCartStore = useContext(ShowCartContextName);
    const cartStore = useContext(CartStoreContextName);
    const totalCount = useSignal(0);

    useTask$(({ track, cleanup }) => {
        track(cartStore);
        totalCount.value = 0;

        for (const key in cartStore) {
            const p = cartStore[key];
            cleanup(() => p.count);
            if (!p.count) {
                delete cartStore[key];
                showCartStore.show = false;
                showCartStore.show = true;
            }
            else {
                track(() => p.count);
                totalCount.value += p.price * p.count;
            };
        }

        return () => {
            cleanup(() => cartStore);
        };
    });
    return <>
        {
            showCartStore.show ? <div class='absolute top-0 left-0 grid grid-cols-2 h-screen w-full z-40 overflow-y-auto overflow-x-hidden'>
                <div class='h-full bg-black/75'></div>
                <div class='h-full bg-white/75 flex flex-col items-center justify-start px-14'>
                    <div class='flex items-center justify-between w-full mt-3'>
                        <button class='drop-shadow-lg' onClick$={() => showCartStore.show = false}>❌</button>
                        <h1 class='text-2xl font-bold'>CART</h1>
                        <div><p class='font-mono'>Total Price: $<b>{totalCount.value}</b></p></div>
                    </div>
                    <div class='w-full mt-4'>{Object.values(cartStore).map(({ id, price, title }) => <div key={id + ':' + price} class="p-4 shadow rounded flex items-center justify-between w-full bg-white px-7 mb-3">
                        <div class='font-semibold'>
                            <p>{title}</p>
                            <p class='mt-5'>${price}</p>
                        </div>
                        <div class='flex flex-col items-end justify-between h-[12vh]'>
                            <button onClick$={() => cartStore[id].count = 0}>❌</button>
                            <div class='flex items-center justify-center'>
                                <button onClick$={() => cartStore[id].count++}>➕</button>
                                <p class='px-2 font-black'>{cartStore[id].count}</p>
                                <button onClick$={() => cartStore[id].count--}>➖</button>
                            </div>
                        </div>
                    </div>)}</div>
                </div>
            </div> : <></>
        }
    </>;
});