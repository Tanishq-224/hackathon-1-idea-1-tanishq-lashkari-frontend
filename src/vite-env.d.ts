/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** @description Optional API root override (defaults to `/api/v1` same-origin). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
