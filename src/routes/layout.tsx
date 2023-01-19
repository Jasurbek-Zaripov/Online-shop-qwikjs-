import { component$, createContext, Slot, useClientEffect$, useContextProvider, useStore } from '@builder.io/qwik';
import TheCarModal from '~/components/TheCarModal';
import TheFooter from '~/components/TheFooter';
import Theheader from '~/components/Theheader';

export interface ICartContextStore {
  id: number,
  title: string,
  price: number,
  count: number;
}

export type cartStoreContextType = { [a: number]: ICartContextStore; };

export const ShowCartContextName = createContext<{ show: boolean; }>('Show-Cart-Context-Name');
export const CartStoreContextName = createContext<cartStoreContextType>('Cart-Store-Context-Name');

export default component$(() => {
  const showCartStore = useStore({ show: false });
  const cartStore = useStore<cartStoreContextType>({}, { recursive: true });
  useClientEffect$(() => {
    const item = localStorage.getItem('cartStore');
    if (item) {
      const obj = JSON.parse(item) as cartStoreContextType;
      for (const key in obj) cartStore[key] = obj[key];
    } else localStorage.setItem('cartStore', JSON.stringify(cartStore));

    window.onbeforeunload = () => localStorage.setItem('cartStore', JSON.stringify(cartStore));
  }, { eagerness: 'load' });
  useContextProvider(ShowCartContextName, showCartStore);
  useContextProvider(CartStoreContextName, cartStore);

  return (
    <>
      <Theheader />
      <TheCarModal />
      <main class='flex-grow'>
        <section class='container mx-auto'>
          <Slot />
        </section>
      </main>
      <TheFooter />
    </>
  );
});
