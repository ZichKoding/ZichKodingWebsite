import { vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface MockQueryBuilder {
  select: (columns?: string) => MockQueryBuilder;
  insert: (data: any) => MockQueryBuilder;
  update: (data: any) => MockQueryBuilder;
  delete: () => MockQueryBuilder;
  eq: (column: string, value: any) => MockQueryBuilder;
  order: (column: string, options?: any) => MockQueryBuilder;
  range: (from: number, to: number) => MockQueryBuilder;
  single: () => MockQueryBuilder;
  ilike: (column: string, value: string) => MockQueryBuilder;
  or: (filterString: string) => MockQueryBuilder;
  in: (column: string, values: any[]) => MockQueryBuilder;
  limit: (count: number) => MockQueryBuilder;
  then: (callback: (value: any) => any) => Promise<any>;
  catch: (callback: (error: any) => any) => Promise<any>;
  data?: any;
  error?: any;
}

export function createMockQueryBuilder(): MockQueryBuilder {
  const builder: any = {
    data: null,
    error: null,
    select: vi.fn(function (this: any, columns?: string) {
      return builder;
    }),
    insert: vi.fn(function (this: any, data: any) {
      builder.data = Array.isArray(data) ? data : [data];
      return builder;
    }),
    update: vi.fn(function (this: any, data: any) {
      builder.data = data;
      return builder;
    }),
    delete: vi.fn(function (this: any) {
      builder.data = null;
      return builder;
    }),
    eq: vi.fn(function (this: any, column: string, value: any) {
      return builder;
    }),
    order: vi.fn(function (this: any, column: string, options?: any) {
      return builder;
    }),
    range: vi.fn(function (this: any, from: number, to: number) {
      return builder;
    }),
    single: vi.fn(function (this: any) {
      if (Array.isArray(builder.data)) {
        builder.data = builder.data[0];
      }
      return builder;
    }),
    ilike: vi.fn(function (this: any, column: string, value: string) {
      return builder;
    }),
    or: vi.fn(function (this: any, filterString: string) {
      return builder;
    }),
    in: vi.fn(function (this: any, column: string, values: any[]) {
      return builder;
    }),
    limit: vi.fn(function (this: any, count: number) {
      return builder;
    }),
    then: vi.fn(function (this: any, callback: (value: any) => any) {
      return Promise.resolve(callback({ data: builder.data, error: builder.error }));
    }),
    catch: vi.fn(function (this: any, callback: (error: any) => any) {
      if (builder.error) {
        return Promise.resolve(callback(builder.error));
      }
      return Promise.resolve(null);
    }),
  };

  return builder;
}

export function createMockSupabaseClient(overrides?: any): Partial<SupabaseClient> {
  return {
    from: vi.fn(() => createMockQueryBuilder()),
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      ...overrides?.auth,
    },
    ...overrides,
  };
}

export function mockQueryBuilderResponse(builder: MockQueryBuilder, data: any, error: any = null) {
  builder.data = data;
  builder.error = error;
}
