declare module "cloudflare:workers" {
  export const env: {
    DB: import("./db/types").Database;
    ADMIN_EMAILS?: string;
    [key: string]: unknown;
  };
}
type D1Database = import("./db/types").Database;
interface Fetcher { fetch(request: Request | string): Promise<Response>; }
