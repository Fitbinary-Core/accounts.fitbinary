const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://admin.fitbinary.com/api/v1";

export const AUTH_URLS = {
  login: `${BASE_URL}/auth/login`,
  logout: `${BASE_URL}/auth/logout`,
  refresh: `${BASE_URL}/auth/refresh`,
  profile: `${BASE_URL}/auth/profile`,
};

export const TENANT_AUTH_URLS = {
  tenant_signup: `${BASE_URL}/auth/tenants/signup`,
  login: `${BASE_URL}/auth/tenants/login`,
  logout: `${BASE_URL}/auth/tenants/logout`,
  refresh: `${BASE_URL}/auth/tenants/refresh`,
  profile: `${BASE_URL}/auth/tenants/profile`,
  profile_update: `${BASE_URL}/auth/tenants/profile`,
  subscription_details: `${BASE_URL}/auth/tenants/subscription/details`,
  forget_password_pin: `${BASE_URL}/tenants/forget-password-pin`,
  verify_forget_password_pin: `${BASE_URL}/tenants/verify-forget-password-pin`,
  reset_password: `${BASE_URL}/tenants/reset-password`,
};

export const ACCOUNTS_APPS_URLS = {
  all_apps: `${BASE_URL}/applications/all/list`,
  all_users_apps: `${BASE_URL}/apps/users/all`,
};

export const BRANCH_URLS = {
  base: `${BASE_URL}/branch`,
  create_main_branch: `${BASE_URL}/branch/create-update/main-branch`,
  my_branches: `${BASE_URL}/branch/my-branches`,
  user_branches: `${BASE_URL}/branch/user_branch_list`,
  source_branch: `${BASE_URL}/branch/source-branch`,
  destination_branches: `${BASE_URL}/branch/destination-branches`,
  one: `${BASE_URL}/branch/:id`,
};

export const USERS_URLS = {
  create: `${BASE_URL}/org-users/create`,
  get_all: `${BASE_URL}/org-users/list`,
  get_one: `${BASE_URL}/org-users/:id`,
  update: `${BASE_URL}/org-users/:id`,
  delete: `${BASE_URL}/org-users/:id`,
};

export const ROLES_URLS = {
  get_roles_list: `${BASE_URL}/roles/list`,
};

export const COMMON_URLS = {
  get_presigned_url: `${BASE_URL}/get-presigned-url`,
  get_logo_presigned_url: `${BASE_URL}/get-logo-presigned-url`,
  get_tenant_avatar_presigned_url: `${BASE_URL}/get-tenant-avatar-presigned-url`,
};

export const ONBOARDING_URLS = {
  get_data: `${BASE_URL}/onboarding/data`,
  create_update_organization: `${BASE_URL}/onboarding/create-update/organization`,
  update_location_and_metadata: `${BASE_URL}/onboarding/update/location-metadata`,
  get_categories: `${BASE_URL}/onboarding/categories`,
  update_categories: `${BASE_URL}/onboarding/update-categories`,
  get_subscriptions: `${BASE_URL}/onboarding/subscriptions`,
  create_update_main_branch: `${BASE_URL}/onboarding/create-update/main-branch`,
};

export const CATEGORIES_URLS = {
  get_all: `${BASE_URL}/categories/list`,
  get_childrens: `${BASE_URL}/tenant/categories/childrens/:id`,
  get_detail: `${BASE_URL}/tenant/categories/:id`,
  update: `${BASE_URL}/tenant/categories/update`,

  organization_categories: `${BASE_URL}/tenant/categories/organization/all`,
};

export const PLANS_URLS = {
  get_all: `${BASE_URL}/plans/list`,
};

export const BILLING_URLS = {
  checkout: `${BASE_URL}/billing/checkout`,
  status: (sessionId: string) => `${BASE_URL}/billing/status/${sessionId}`,
  verify_esewa: `${BASE_URL}/billing/esewa/verify`,
  start_free_trail: `${BASE_URL}/billing/start-free-trail`,
  organization_subscriptions: `${BASE_URL}/billing/organizations/subscriptions`,
};

export const ORGANIZATION_URLS = {
  list: `${BASE_URL}/organizations/list`,
  update: (org_id: string) => `${BASE_URL}/organizations/update/${org_id}`,
  detail: (org_id: string) => `${BASE_URL}/organizations/detail/${org_id}`,
};
