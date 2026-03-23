export interface Staff {
  accountId: string;
  name: string;
  phone: string;
  role: string;
  teamName: string | null;
  teamSize: number | null;
  latitude: number | null;
  longitude: number | null;
}

export interface LoginPayload {
  phone: string;
  password: string;
}
