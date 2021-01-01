export interface UserData {
  id: string;
  tenantId?: string;
  userName: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  lockoutEnabled?: boolean;
  twoFactorEnabled?: boolean;
}
