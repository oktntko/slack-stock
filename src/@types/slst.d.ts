type SlackConfig = {
  token: string;
};

type Config = {
  default: string;
  slack_config: Record<string, SlackConfig>;
};

type FetchSelection = "message" | "user" | "channel";
