type SlackConfig = {
  token: string;
};

type Slstrc = {
  default: string;
  slack_config: Record<string, SlackConfig>;
};

type MenuSelection =
  | "fetch"
  | "output"
  | "config"
  | "tutorial"
  | "contact"
  | "exit";

type DataType = "message" | "user" | "channel";

type OutputType = "console" | "csv" | "tsv" | "json" | "excel";
