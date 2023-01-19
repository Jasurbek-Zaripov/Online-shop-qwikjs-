import { component$, Slot, useClientEffect$, useStore } from "@builder.io/qwik";
import TheImage from "./TheImage";

export interface IShowImageProp {
    title: string;
    image: string;
    alt?: string;
}
export default component$((p: IShowImageProp) => {
    const state = useStore({ title: '', image: '' });

    useClientEffect$(({ track }) => {
        track(() => state.image);
        state.image = p.image;
        state.title = p.title;
    });

    return <div class='relative top-0 left-0 h-[40vh] rounded overflow-hidden shadow'>
        <div class='opacity-0 hover:opacity-100 absolute top-0 left-0 w-full h-full bg-black/30 flex flex-col items-center justify-center z-10 transition-opacity backdrop-blur'>
            <p class='text-5xl text-gr bg-gradient-to-tr from-red-600 to-yellow-600 text-center'>{state.title}</p>
            <Slot />
        </div>
        <TheImage src={state.image} alt={state.title} className="absolute top-0 left-0 h-full w-full" />
    </div>;
});