export interface User {
  email: string;
  expiresIn: string;
  idToken: string;
  localId: string;
  logOutDate: null | Date;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: string;
  id_token: string;
  project_id: string;
  refresh_token: string;
  token_type: string;
  user_id: string;
}
