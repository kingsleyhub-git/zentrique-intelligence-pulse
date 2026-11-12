import { describe, expect, it } from "vitest";
import {
  analyze,
  cleanData,
  detectMapping,
  forecastSeries,
  mappingProblem,
  parseMonth,
  parseNumber,
} from "@/lib/pulse/analytics";
import { generateSampleRows, SAMPLE_HEADERS } from "@/lib/pulse/sample";

describe("PULSE column detection", () => {
  it("matches common header names to fields", () => {
    const m = detectMapping(["Order Date", "Item Name", "Branch", "Sales Amount", "Total Cost", "Qty"]);
    expect(m.date).toBe("Order Date");
    expect(m.product).toBe("Item Name");
    expect(m.region).toBe("Branch");
    expect(m.revenue).toBe("Sales Amount");
    expect(m.cost).toBe("Total Cost");
    expect(m.quantity).toBe("Qty");
  });

  it("requires a date and a revenue source", () => {
    const m = detectMapping(["Product", "Revenue"]);
    expect(mappingProblem(m)).not.toBeNull();
    expect(mappingProblem({ ...m, date: "Date" })).toBeNull();
  });
});

describe("PULSE value parsing", () => {
  it("reads currency-formatted numbers", () => {
    expect(parseNumber("KES 1,250.50")).toBe(1250.5);
    expect(parseNumber("(300)")).toBe(-300);
    expect(parseNumber("1.250,5")).toBe(1250.5);
    expect(parseNumber("n/a")).toBeNull();
  });

  it("reads ISO, day-first and named dates to months", () => {
    expect(parseMonth("2026-03-15")).toBe("2026-03");
    expect(parseMonth("15/03/2026", true)).toBe("2026-03");
    expect(parseMonth("03/15/2026", false)).toBe("2026-03");
    expect(parseMonth("")).toBeNull();
  });
});

describe("PULSE cleaning and KPIs", () => {
  const rows = [
    { Date: "2026-01-05", Product: "A", Qty: 2, Price: 100, Cost: 120 },
    { Date: "2026-01-05", Product: "A", Qty: 2, Price: 100, Cost: 120 }, // duplicate
    { Date: "", Product: "B", Qty: 1, Price: 50, Cost: 10 }, // no date
    { Date: "2026-02-10", Product: "B", Qty: 3, Price: 100, Cost: 100 },
  ];
  const mapping = { ...detectMapping(Object.keys(rows[0]!)), unitPrice: "Price" };

  it("removes duplicates, excludes undated rows and computes revenue from quantity × price", () => {
    const { records, report } = cleanData(rows, mapping);
    expect(report.duplicatesRemoved).toBe(1);
    expect(report.missingDate).toBe(1);
    expect(records.map((r) => r.revenue)).toEqual([200, 300]);
  });

  it("calculates total revenue, gross margin and month-on-month growth", () => {
    const a = analyze(cleanData(rows, mapping).records);
    expect(a.kpis.totalRevenue).toBe(500);
    expect(a.kpis.grossMargin).toBeCloseTo(280 / 500);
    expect(a.kpis.momGrowth).toBeCloseTo(0.5);
    expect(a.products[0]?.name).toBe("B");
  });
});

describe("PULSE forecasting", () => {
  it("returns the requested number of non-negative months after the last month", () => {
    const f = forecastSeries([100, 120, 140, 160, 180, 200], "2026-06", 6);
    expect(f?.points).toHaveLength(6);
    expect(f?.points[0]?.month).toBe("2026-07");
    expect(f!.points.every((p) => p.lower >= 0 && p.lower <= p.value && p.value <= p.upper)).toBe(true);
    expect(f!.points[0]!.value).toBeGreaterThan(190);
  });

  it("needs at least 3 months", () => {
    expect(forecastSeries([1, 2], "2026-02", 3)).toBeNull();
  });

  it("uses seasonal smoothing on the 24-month sample and flags its data problems", () => {
    const { records, report } = cleanData(generateSampleRows(), detectMapping(SAMPLE_HEADERS));
    expect(report.duplicatesRemoved).toBe(2);
    expect(report.missingDate).toBe(1);
    expect(report.invalidRevenue).toBe(1);
    const a = analyze(records);
    expect(a.monthly).toHaveLength(24);
    const f = forecastSeries(a.monthly.map((m) => m.revenue), a.monthly[23]!.month, 6);
    expect(f?.seasonal).toBe(true);
  });
});
