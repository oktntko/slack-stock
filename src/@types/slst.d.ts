type SlackConfig = {
  token: string;
};

type Config = {
  default: string;
  slack_config: Record<string, SlackConfig>;
};

type DataType = "message" | "user" | "channel";

type OutputType = "console" | "csv" | "tsv" | "json" | "excel";
