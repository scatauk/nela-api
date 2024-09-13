import { afterAll, describe, expect, test, vi } from "vitest";
import { logger } from "../src/logger.js";

describe("debugging mode", () => {
  const consoleMock = vi.spyOn(console, "log").mockImplementation(() => undefined);

  afterAll(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    consoleMock.mockReset();
  });

  test("is turned off when NELA_DEBUG=false", () => {
    vi.stubEnv("NELA_DEBUG", "false");
    logger("sample output");
    expect(consoleMock).not.toHaveBeenCalled();
  });
  test("works when NELA_DEBUG=true", () => {
    vi.stubEnv("NELA_DEBUG", "true");
    logger("sample output");
    expect(consoleMock).toHaveBeenCalled();
    expect(consoleMock).toHaveBeenLastCalledWith("sample output");
  });
});
