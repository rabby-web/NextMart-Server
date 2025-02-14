import { UserRole } from '../modules/user/user.interface';

export type VerifiedUser = {
   email: string;
   role: UserRole;
   iat: number;
   exp: number;
};
