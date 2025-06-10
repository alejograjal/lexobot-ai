import { type components } from "@/api/clients/lexobot-ai/api";

type SchemaTypes = keyof components["schemas"];
export type SchemaType<T extends SchemaTypes> = components["schemas"][T];

export type SchemaTypeWithId<T extends SchemaTypes> = components["schemas"][T] & {
  id: string;
};

export type Roles = 'Administrator' | 'Company' | 'Tenant'

export type ErrorDetail = components["schemas"]["ErrorResponse"]["error"];
export type UserProfile = components["schemas"]["UserProfile"];

export type LoginRequest = components["schemas"]["LoginRequest"];
export type RefreshTokenRequest = components["schemas"]["RefreshTokenRequest"];
export type TokenResponse = components["schemas"]["TokenResponse"];

export type CompanyCreate = components["schemas"]["CompanyCreate"];
export type CompanyUpdate = components["schemas"]["CompanyUpdate"];
export type CompanyResponse = components["schemas"]["CompanyResponse"];

export type RoleUpdate = components["schemas"]["RoleUpdate"];
export type RoleResponse = components["schemas"]["RoleResponse"];

export type UserCreate = components["schemas"]["UserCreate"];
export type UserUpdate = components["schemas"]["UserUpdate"];
export type UserResponse = components["schemas"]["UserResponse"];