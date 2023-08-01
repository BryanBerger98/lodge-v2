import { UserRoleWithOwner } from '@/types/user.type';

export type Permission = Record<UserRoleWithOwner, boolean>;
export type Actions = Record<string, Permission>;