import { afterAll, describe, expect, test, vi } from 'vitest';

describe('debugging mode', () => {
  const consoleMock = vi.spyOn(console, 'log');

  afterAll(() => {
    consoleMock.mockReset();
  });

  // test("works when NELA_DEBUG=true", () => {
  //   vi.stubEnv("NELA_DEBUG", "true");
  //   expect(consoleMock).toHaveBeenLastCalledWith("sample output");
  // });
  // test("is turned off when NELA_DEBUG=false", () => {
  //   vi.stubEnv("NELA_DEBUG", "false");
  //   expect(consoleMock).toHaveBeenLastCalledWith("sample output");
  // });
  test('is turned off when NELA_DEBUG is not set', () => {
    expect(consoleMock).not.toHaveBeenCalled();
  });
});
