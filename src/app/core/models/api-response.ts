export interface ApiMessage {
  type: string;
  message: string;
}
export interface ApiResponse<T> {
  status: string;
  message: ApiMessage[];
  data: T;
}
export interface AuthData {
  id: number;
  fullName: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}
export interface RefreshData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}