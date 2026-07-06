export const getString = (value: unknown, def: string): string => {
  return String(value).trim() || def;
};
