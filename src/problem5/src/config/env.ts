export const GetEnv = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (value === undefined || value === null) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not set.`);
  }
  return value;
};

export const GetEnvAsNumber = (name: string, defaultValue?: number): number => {
  const value = process.env[name];
  if (value === undefined || value === null) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not set.`);
  }
  const parsedValue = Number(value);
  if (isNaN(parsedValue)) {
    throw new Error(`Environment variable ${name} is not a valid number.`);
  }
  return parsedValue;
};

export const GetEnvAsBoolean = (
  name: string,
  defaultValue?: boolean
): boolean => {
  const value = process.env[name];
  if (value === undefined || value === null) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not set.`);
  }
  if (value.toLowerCase() === "true") {
    return true;
  } else if (value.toLowerCase() === "false") {
    return false;
  } else {
    throw new Error(`Environment variable ${name} is not a valid boolean.`);
  }
};
