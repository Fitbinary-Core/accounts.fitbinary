export async function apiClient(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const opts: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      ...(options.body && { "Content-Type": "application/json" }),
    },
  };

  const res = await fetch(url, opts);

  // if (res.status === 403) {
  //   window.location.href = "/unauthorized";
  //   return Promise.reject(new Error("Forbidden"));
  // }

  return res;
}
