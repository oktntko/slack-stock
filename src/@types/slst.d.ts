type ObjectType = "teams" | "data" | "messages";

type ActionType =
  | "teams-add"
  | "teams-view"
  | "data-fetch"
  | "data-view"
  | "messages-stock"
  | "messages-view"
  | "messages-search";

type OutputType = "console" | "csv" | "tsv" | "xlsx";

type RequireOne<T, K extends keyof T = keyof T> = K extends keyof T ? PartialRequire<T, K> : never;

type PartialRequire<O, K extends keyof O> = {
  [P in K]-?: O[P];
} & O;
