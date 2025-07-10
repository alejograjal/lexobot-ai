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

export type PlanCategoryCreate = components["schemas"]["PlanCategoryCreate"];
export type PlanCategoryUpdate = components["schemas"]["PlanCategoryUpdate"];
export type PlanCategoryResponse = components["schemas"]["PlanCategoryResponse"];

export type PlanCreate = components["schemas"]["PlanCreate"];
export type PlanUpdate = components["schemas"]["PlanUpdate"];
export type PlanResponse = components["schemas"]["PlanResponse"];

export type TenantCreate = components["schemas"]["TenantCreate"];
export type TenantUpdate = components["schemas"]["TenantUpdate"];
export type TenantResponse = components["schemas"]["TenantResponse"];

export type CompanyAccessCreate = components["schemas"]["CompanyAccessCreate"];
export type CompanyAccessUpdate = components["schemas"]["CompanyAccessUpdate"];
export type CompanyAccessResponse = components["schemas"]["CompanyAccessResponse"];

export type CompanyTenantCreate = components["schemas"]["CompanyTenantAssignmentCreate"];
export type CompanyTenantBulk = components["schemas"]["CompanyTenantAssignmentBulkSync"];
export type CompanyTenantResponse = components["schemas"]["CompanyTenantAssignmentResponse"];

export type TenantDocumentCreate = components["schemas"]["TenantDocumentCreate"];
export type TenantDocumentCount = components["schemas"]["TenantDocumentCount"];
export type TenantDocumentCreateWithFile = TenantDocumentCreate & { file: File };
export type TenantDocumentResponse = components["schemas"]["TenantDocumentResponse"];

export type CompanyUserCreate = components["schemas"]["CompanyUserCreate"];
export type CompanyUserUpdate = components["schemas"]["CompanyUserUpdate"];
export type CompanyUserResponse = components["schemas"]["CompanyUserResponse"];
export type CompanyUserBulk = components["schemas"]["CompanyUserBulkSync"];

export type TenantUserCreate = components["schemas"]["TenantUserCreate"];
export type TenantUserUpdate = components["schemas"]["TenantUserUpdate"];
export type TenantUserResponse = components["schemas"]["TenantUserResponse"];
export type TenantUserBulk = components["schemas"]["TenantUserBulkSync"];

export type MetricsOverviewResponse = components["schemas"]["MetricsOverviewResponse"];
export type MetricsByPeriod = components["schemas"]["PeriodCount"];
export type TotalQuestions = components["schemas"]["QuestionCount"];

export type UserAccountConfirmation = components["schemas"]["UserAccountConfirmation"];
export type UserChangePassword = components["schemas"]["UserChangePassword"];

export type ResetPassword = components["schemas"]["ResetPasswordRequest"];

export type PeriodType = "day" | "week" | "month";