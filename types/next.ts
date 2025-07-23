// types/next.ts
export type PageProps<
  TParams extends Record<string, string> = {},
  TSearchParams extends Record<string, string | string[]> = {}
> = {
  params: Promise<TParams>;
  searchParams: TSearchParams;
};
