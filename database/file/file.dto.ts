import { IFile } from '@/schemas/file';

export type CreateFileDTO = Omit<IFile, 'id' | 'created_at' | 'updated_at' | 'updated_by'>