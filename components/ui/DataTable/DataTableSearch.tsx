import dynamic from 'next/dynamic';

const InputSearch = dynamic(() => import('../../forms/Input/InputSearch'), { ssr: false });

type DataTableSearchProps = {
    defaultSearchValue?: string;
    placeholder?: string;
    onSearch?: (value: string) => void;
};

const DataTableSearch = ({ defaultSearchValue = '', placeholder, onSearch: handleSearch }: DataTableSearchProps) => {

	return (
		<InputSearch
			className="flex-grow lg:flex-grow-0 lg:w-1/2"
			defaultValue={ defaultSearchValue }
			inputClassName="max-w-sm"
			placeholder={ placeholder || 'Search...' }
			onSearch={ handleSearch }
		/>
	);
};
DataTableSearch.displayName = 'DataTableSearch';

export default DataTableSearch;