export const serializeData = (data: any): any => {
  if (data === null || data === undefined) return data;

  if (typeof data === "object") {
    if (data instanceof Date) {
      return data.toISOString();
    }

    // Handle Decimal objects (recognized by having a 's' property)
    if ("s" in data && "d" in data) {
      return String(data);
    }

    if (Array.isArray(data)) {
      return data.map(serializeData);
    }

    const result: Record<string, any> = {};
    for (const key in data) {
      result[key] = serializeData(data[key]);
    }
    return result;
  }

  return data;
};
