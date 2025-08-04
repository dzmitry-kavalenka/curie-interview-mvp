import { formatDate } from "../date-utils";

describe("formatDate", () => {
  beforeEach(() => {
    // Mock the current date to ensure consistent test results
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-08-04T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should format a recent date as "Just now"', () => {
    const testDate = "2025-08-04T11:59:30.000Z"; // 30 seconds ago
    const result = formatDate(testDate);
    expect(result).toBe("Just now");
  });

  it("should format a date from hours ago", () => {
    const testDate = "2025-08-04T10:00:00.000Z"; // 2 hours ago
    const result = formatDate(testDate);
    expect(result).toBe("2 hours ago");
  });

  it("should format a date from days ago", () => {
    const testDate = "2025-07-30T12:00:00.000Z"; // 5 days ago
    const result = formatDate(testDate);
    expect(result).toBe("7/30/2025");
  });

  it("should handle invalid date strings", () => {
    const invalidDate = "invalid-date";
    const result = formatDate(invalidDate);
    expect(result).toBe("Invalid Date");
  });

  it("should handle empty string", () => {
    const result = formatDate("");
    expect(result).toBe("Invalid Date");
  });

  it("should handle null and undefined", () => {
    // null gets converted to Date(0) which is 1/1/1970
    // undefined gets converted to Invalid Date
    expect(formatDate(null as unknown as string)).toBe("1/1/1970");
    expect(formatDate(undefined as unknown as string)).toBe("Invalid Date");
  });
});
