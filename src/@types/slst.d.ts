type SlackConfig = {
  token: string;
};

type SlackStockRc = {
  default: string;
  slack_config: Record<string, SlackConfig>;
};

type MenuSelection =
  | "stock"
  | "view"
  | "config"
  | "tutorial"
  | "contact"
  | "exit";

type DataType = "message" | "user" | "channel";

type OutputType = "console" | "csv" | "tsv" | "json" | "excel";
