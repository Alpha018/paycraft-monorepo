export interface Identities {
  email: string[];
}

export interface Firebase {
  identities: Identities;
  sign_in_provider: string;
}

export interface User {
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  firebase: Firebase;
  uid: string;
}
