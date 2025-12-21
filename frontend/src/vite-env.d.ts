/// <reference types="vite/client" />

// interface que define a tipagem das variáveis de ambiente personalizadas do vite
interface ImportMetaEnv {
  // define a url base da api como uma string somente leitura
  readonly VITE_API_BASE_URL: string
}

// interface que estende o objeto import.meta padrão do javascript
interface ImportMeta {
  // adiciona a propriedade env tipada com a interface definida acima
  readonly env: ImportMetaEnv
}