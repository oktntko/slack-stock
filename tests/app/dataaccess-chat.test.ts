import dayjs from "dayjs";
import { CHAT_CLIENT } from "../../src/app/dataaccess-chat";

jest.mock("@slack/web-api", () => {
  const mockClient = {
    team: {
      info: jest.fn().mockReturnValue("team.info"),
    },
    users: {
      list: jest.fn().mockReturnValue("users.list"),
    },
    conversations: {
      list: jest.fn().mockReturnValue("conversations.list"),
      history: jest.fn().mockReturnValue("conversations.history"),
    },
  };
  return {
    WebClient: jest.fn(() => mockClient),
    LogLevel: {
      ERROR: "error",
      WARN: "warn",
      INFO: "info",
      DEBUG: "debug",
    },
  };
});

describe("test chat api", () => {
  test("team.info", async () => {
    const result = await CHAT_CLIENT.team.info("token");
    expect(result).toBe("team.info");
  });
  test("users.list", async () => {
    const result = await CHAT_CLIENT.users.list("token");
    expect(result).toBe("users.list");
  });
  test("conversations.list", async () => {
    const result = await CHAT_CLIENT.conversations.list("token");
    expect(result).toBe("conversations.list");
  });
  test("conversations.history", async () => {
    const result = await CHAT_CLIENT.conversations.history("token", "channel", dayjs(), dayjs());
    expect(result).toBe("conversations.history");
  });
});
