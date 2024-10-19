export interface UserFields {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName?: string;
  googleID?: string;
  avatar?: string;
}

export interface PhotoMutation {
  title: string;
  image: string | null;
  author: string;
}