/**
 * Converts a boot height string ("6in", "10in") to the display form ("6\"", "10\"").
 * Returns "unknown" for undefined or the literal "unknown" value.
 */
export function formatBootHeight(height?: string): string {
  if (!height || height === "unknown") return "unknown";
  return height.replace("in", '"');
}

/**
 * Converts a snake_case value to a space-separated label ("defined_heel" → "defined heel").
 * Returns an empty string for undefined or empty input.
 */
export function formatLabel(value?: string): string {
  if (!value) return "";
  return value.replaceAll("_", " ");
}

/**
 * Converts a sole value to a readable label ("defined_heel" → "defined heel").
 * Returns "unknown" for undefined or the literal "unknown" value.
 */
export function formatSole(sole?: string): string {
  if (!sole || sole === "unknown") return "unknown";
  return formatLabel(sole);
}
