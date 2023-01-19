import { component$ } from "@builder.io/qwik";
export interface IImageProp {
    src: string;
    alt: string;
    className: string;
}

export default component$(({ alt, src, className }: IImageProp) => {
    return <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        class={className}
        height="480"
        width="640"
    />;
});