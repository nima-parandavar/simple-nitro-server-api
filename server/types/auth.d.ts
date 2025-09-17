export interface Auth {
  firstName?: string;
  lastName?: string;
  email: string;
  role: "admin" | "user";
}
