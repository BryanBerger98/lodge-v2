import { Role } from '@/schemas/role.schema';

export type Permission = Record<Role, boolean>;
export type Actions = Record<string, Permission>;