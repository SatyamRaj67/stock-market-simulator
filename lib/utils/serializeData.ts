export const serializeData = (data: unknown): unknown => {
  if (data === null || data === undefined) return data;

  if (typeof data === "object") {
    if (data instanceof Date) {
      return data.toISOString();
    }

    // Handle Decimal objects (recognized by having a 's' property)
    if (data !== null && "s" in data && "d" in data) {
      return String(data);
    }

    if (Array.isArray(data)) {
      return data.map(serializeData);
    }

    const result: Record<string, unknown> = {};
    for (const key in data) {
      result[key] = serializeData((data as Record<string, unknown>)[key]);
    }
    return result;
  }

  return data;
};
