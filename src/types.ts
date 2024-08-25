export interface UserEntity {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: number;
}

export interface ContextEntity {
  user: string;
}
