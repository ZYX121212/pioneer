export type DatabaseResult<T = Record<string, unknown>> = { success: boolean; results: T[]; meta: { changes: number; last_row_id: number }; error?: string };
export interface DatabaseStatement {
  bind(...values: unknown[]): DatabaseStatement;
  first<T = Record<string, unknown>>(column?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<DatabaseResult<T>>;
  run<T = Record<string, unknown>>(): Promise<DatabaseResult<T>>;
}
export interface Database { prepare(query: string): DatabaseStatement; batch<T = Record<string, unknown>>(statements: DatabaseStatement[]): Promise<DatabaseResult<T>[]>; }
