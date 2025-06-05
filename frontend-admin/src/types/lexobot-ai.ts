import { type components } from "@/api/clients/lexobot-ai/api";

type SchemaTypes = keyof components["schemas"];
export type SchemaType<T extends SchemaTypes> = components["schemas"][T];
export type SchemaTypeWithId<T extends SchemaTypes> = components["schemas"][T] & {
  id: string;
};

export type ErrorDetail = components["schemas"]["ErrorResponse"]["error"];

export type LoginRequest = components["schemas"]["LoginRequest"];
export type RefreshTokenRequest = components["schemas"]["RefreshTokenRequest"];

export type TokenResponse = components["schemas"]["TokenResponse"];