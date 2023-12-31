import { IUserPopulated } from '@/schemas/user/populated.schema';

type UserCreatedAtCellProps = {
	rowData: IUserPopulated;
}

const UserCreatedAtCell = ({ rowData }: UserCreatedAtCellProps) => rowData.created_at ? <span>{ new Date(rowData.created_at).toLocaleDateString('fr') } { new Date(rowData.created_at).toLocaleTimeString('fr') }</span> : null; 

export default UserCreatedAtCell;