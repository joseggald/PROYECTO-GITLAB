import Cookies from "js-cookie";

export const saveDataToCookie = <T>(
  name: string,
  data: T,
  options?: Cookies.CookieAttributes
) => {
  const value = typeof data === "string" ? data : JSON.stringify(data);
  Cookies.set(name, value, options);
};

export const getDataFromCookie = <T = string>(name: string): T | null => {
  const rawData = Cookies.get(name);
  if (!rawData) return null;

  try {
    return JSON.parse(rawData) as T;
  } catch {
    return rawData as T;
  }
};

export const deleteCookie = (name: string) => {
  Cookies.remove(name);
};
