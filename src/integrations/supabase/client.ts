import type { Database } from "./types";

type QueryFilter =
  | { type: "eq"; column: string; value: unknown }
  | { type: "neq"; column: string; value: unknown }
  | { type: "in"; column: string; value: unknown[] }
  | { type: "ilike"; column: string; value: string };

type QueryOptions = {
  single?: boolean;
  maybeSingle?: boolean;
  count?: string | null;
  head?: boolean;
  onConflict?: string;
};

const API_URL = typeof window !== "undefined" ? window.location.origin : "http://localhost:8787";

async function request(table: string, body: Record<string, unknown>) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const response = await fetch(`${API_URL}/db/query/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : {};

  if (!response.ok) {
    return {
      data: null,
      error: {
        message: parsed?.error || "Database request failed",
        code: parsed?.code,
      },
      count: null,
    };
  }

  return {
    data: parsed?.data ?? null,
    error: parsed?.error ?? null,
    count: parsed?.count ?? null,
  };
}

class QueryBuilder<T = unknown> implements PromiseLike<{ data: T; error: any; count?: number | null }> {
  private readonly table: string;
  private operation: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private filters: QueryFilter[] = [];
  private payload: unknown = null;
  private orderBy: { column: string; ascending: boolean } | null = null;
  private options: QueryOptions = {};
  private queryLimit: number | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(_columns = "*", options: { count?: "exact"; head?: boolean } = {}) {
    this.operation = this.operation === "insert" || this.operation === "update" || this.operation === "upsert" ? this.operation : "select";
    if (options.count) this.options.count = options.count;
    if (options.head) this.options.head = true;
    return this;
  }

  insert(payload: unknown) {
    this.operation = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: unknown) {
    this.operation = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.operation = "delete";
    return this;
  }

  upsert(payload: unknown, options: { onConflict?: string } = {}) {
    this.operation = "upsert";
    this.payload = payload;
    this.options.onConflict = options.onConflict;
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push({ type: "eq", column, value });
    return this;
  }

  neq(column: string, value: unknown) {
    this.filters.push({ type: "neq", column, value });
    return this;
  }

  in(column: string, value: unknown[]) {
    this.filters.push({ type: "in", column, value });
    return this;
  }

  ilike(column: string, value: string) {
    this.filters.push({ type: "ilike", column, value });
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.orderBy = { column, ascending: options.ascending !== false };
    return this;
  }

  limit(value: number) {
    this.queryLimit = value;
    return this;
  }

  single() {
    this.options.single = true;
    return this.execute();
  }

  maybeSingle() {
    this.options.maybeSingle = true;
    return this.execute();
  }

  async execute() {
    return request(this.table, {
      operation: this.operation,
      filters: this.filters,
      payload: this.payload,
      order: this.orderBy,
      options: this.options,
      limit: this.queryLimit,
    });
  }

  then<TResult1 = { data: T; error: any; count?: number | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T; error: any; count?: number | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export const supabase = {
  from<T extends keyof Database["public"]["Tables"] | string>(table: T) {
    return new QueryBuilder<any>(String(table));
  },
  functions: {
    async invoke(name: string, options: { body?: unknown } = {}) {
      if (name !== "ai-assist") {
        return {
          data: null,
          error: { message: `Unsupported function: ${name}` },
        };
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      const response = await fetch(`${API_URL}/ai/assist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(options.body || {}),
      });
      const text = await response.text();
      const parsed = text ? JSON.parse(text) : {};

      if (!response.ok) {
        return {
          data: null,
          error: { message: parsed?.error || "Function invocation failed" },
        };
      }

      return {
        data: parsed,
        error: null,
      };
    },
  },
};
