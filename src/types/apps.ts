export interface IApplication {
  _id: string;
  name: string;
  description: string;
  version: string;
  baseRoute: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  app_slug: string;
}

export interface IAppsResponse {
  message: string;
  applications: IApplication[];
}
