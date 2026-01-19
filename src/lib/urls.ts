const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://admin.fitbinary.com/api/v1";
// const BASE_URL =
// process.env.NEXT_PUBLIC_API_URL || "http://localhost:4400/api/v1";
//
export const AUTH_URLS = {
  login: `${BASE_URL}/auth/login`,
  logout: `${BASE_URL}/auth/logout`,
  refresh: `${BASE_URL}/auth/refresh`,
  profile: `${BASE_URL}/auth/profile`,
};

export const TENANT_AUTH_URLS = {
  tenant_signup: `${BASE_URL}/tenants/signup`,
  login: `${BASE_URL}/tenants/login`,
  logout: `${BASE_URL}/tenants/logout`,
  refresh: `${BASE_URL}/tenants/refresh`,
  profile: `${BASE_URL}/tenants/profile`,
};
