import { trpc } from '../../api';
import Select, { MultiValue } from "react-select";

type Option = {
	value: { id: number; name: string };
	label: string;
};

type FiltersProps = {
	setCategoryFilters: (filters: Array<{ id: number; name: string }>) => void;
	setCountryFilters: (filters: Array<{ id: number; name: string }>) => void;
};

export default function Filters({ setCategoryFilters, setCountryFilters }: FiltersProps) {
	const filters = trpc.posts.getFilters.useQuery();

	const categoryOptions: Option[] = [];
	if (filters.data?.categories) {
		categoryOptions.push(
			...filters.data.categories.map((category) => ({
				value: category,
				label: category.name,
			}))
		);
	}

	const countryOptions: Option[] = [];
	if (filters.data?.countries) {
		countryOptions.push(
			...filters.data.countries.map((country) => ({
				value: country,
				label: country.name,
			}))
		);
	}

	const handleCategorySelect = (
		selectedOptions: MultiValue<Option | null>,
	) => {
		const parsedFilters = (selectedOptions || []).filter(
			(option): option is Option => option !== null
		);
		setCategoryFilters(parsedFilters.map((option) => option.value));
	};

	const handleCountrySelect = (
		selectedOptions: MultiValue<Option | null>,
	) => {
		const parsedFilters = (selectedOptions || []).filter(
			(option): option is Option => option !== null
		);
		setCountryFilters(parsedFilters.map((option) => option.value));
	};

	return (
		<div className="flex gap-4 items-center place-items-center justify-center mb-3 mt-3">
			<Select
				isMulti
				className="basic-single"
				classNamePrefix="select"
				defaultValue={null}
				options={categoryOptions}
				onChange={handleCategorySelect}
			/>
			<Select
				isMulti
				className="basic-single"
				classNamePrefix="select"
				defaultValue={null}
				options={countryOptions}
				onChange={handleCountrySelect}
			/>
		</div>
	);
}
