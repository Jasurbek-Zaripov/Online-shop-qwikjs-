import { component$, useStylesScoped$ } from "@builder.io/qwik";
import TheHeaderStyle from './TheHeader.css?inline';

export default component$(() => {
    useStylesScoped$(TheHeaderStyle);

    return <footer class='bg-black/30 backdrop-blur-lg h-20 mt-5'>
        <div class='container mx-auto flex items-center justify-between px-14 h-full'>
            <div>
                <p>ONLINE SHOP</p>
            </div>
            <div>
                <p>Powered by Jasur</p>
            </div>
            <div>
                <p>{new Date().toLocaleDateString('ru', { dateStyle: 'full' })}</p>
            </div>
        </div>
    </footer>;
});