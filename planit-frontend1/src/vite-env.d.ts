/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_AUTH_URL: string;
  // ajoute ici d'autres variables VITE_ si tu en as
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}