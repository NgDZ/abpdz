export interface Credentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}


export function setJwtToken(token) {
  return localStorage.setItem('auth-tokens', JSON.stringify(token));
}
export function removeJwtToken() {
  return localStorage.removeItem('auth-tokens');
}
export interface AuthTokenModel {
  access_token: string | null;
  refresh_token: string | null;
  id_token: string | null;
  expires_in: number | null;
  token_type: string | null;
  issued_date: number | null;
  expiration_date: number | null;
  refresh_count: number | null;
  
}
export interface RefreshGrantModel {
  refresh_token: string;
}

export interface ProfileModel {
  name: string;
  sub: string | null;
  jti: string | null;
  useage: string | null;
  at_hash: string | null;
  nbf: number | null;
  exp: number | null;
  iat: number | null;
  iss: string | null;

  unique_name: string | null;
  email_confirmed: boolean;
  role: string[];
  permission?: string[];
}
