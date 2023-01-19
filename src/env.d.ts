/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_STORY_HOST: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
