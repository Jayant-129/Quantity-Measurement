import { beforeEach, afterEach, describe, expect, it, jest } from "@jest/globals";
import { getUnits, getConversion, getHistory, saveHistory } from "../js/api.js";

describe("api module", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("getUnits returns parsed JSON for successful response", async () => {
    const payload = [{ symbol: "m", label: "meter" }];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => payload
    });

    await expect(getUnits("length")).resolves.toEqual(payload);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("getUnits throws on non-ok response", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });
    await expect(getUnits("length")).rejects.toThrow("Network error");
  });

  it("getConversion returns identity conversion for same units", async () => {
    await expect(getConversion("m", "m")).resolves.toEqual([{ factor: 1, formula: null }]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("getConversion returns the first conversion record", async () => {
    const payload = [{ from: "m", to: "cm", factor: 100 }];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => payload
    });

    await expect(getConversion("m", "cm")).resolves.toEqual(payload);
  });

  it("getConversion throws if conversion is missing", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });

    await expect(getConversion("m", "kg")).rejects.toThrow("Conversion not found");
  });

  it("saveHistory returns null if POST is not ok", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 400 });
    await expect(saveHistory({ value: 1 })).rejects.toThrow("Failed to save history");
  });

  it("getHistory returns empty array when fetch fails", async () => {
    global.fetch.mockRejectedValue(new Error("network"));
    await expect(getHistory()).rejects.toThrow("Failed to load history");
  });
});