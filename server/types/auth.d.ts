export interface Auth {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: "admin" | "user";
}
