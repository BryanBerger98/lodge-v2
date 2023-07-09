import { Table, TableBody, TableHead, TableHeader, TableRow } from '../ui/table';

type Row<TData> = {
	id: string | number,
} & TData;

type Column<TData> = {
	key: string,
	title: string,
	render?: (props: TData) => JSX.Element;
	sortable: boolean;
};

type DataTableProps<TData> = {
	columns: Column<TData>[];
	data: Row<TData>[];
}

const DataTable = <TData extends {}>({ columns, data }: DataTableProps<TData>) => {

	return (
		<Table>
			<TableHeader>
				{
					columns.map(column => (
						<TableHead key={ column.key }>
							{ column.title }
						</TableHead>
					))
				}
			</TableHeader>
			<TableBody>
				{
					data.map(row => (
						<TableRow key={ row.id }>
						</TableRow>
					))
				}
			</TableBody>
		</Table>
	);
};

export default DataTable;