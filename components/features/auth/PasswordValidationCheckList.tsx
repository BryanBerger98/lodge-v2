import { Check, X } from 'lucide-react';

import { FormMessage } from '@/components/ui/form';
import { validatePassword } from '@/utils/password.util';

type PasswordValidationCheckListProps = {
	value: string;
	passwordRules: {
		uppercase_min: number;
		lowercase_min: number;
		numbers_min: number;
		symbols_min: number;
		min_length: number;
		should_contain_unique_chars: boolean;
	};
};

const PasswordValidationCheckList = ({ value, passwordRules }: PasswordValidationCheckListProps) => {

	const hasRules = Object.entries(passwordRules).filter(([ , value ]) => value).length > 1;

	if (!hasRules) {
		return <FormMessage />;
	}
	
	const validation = validatePassword(value, passwordRules);
	
	return (
		<div className="rounded-md bg-muted p-2 text-sm">
			<ul className="flex flex-col gap-1 text-slate-700">
				{
					passwordRules.uppercase_min && passwordRules.uppercase_min > 0 ?
						<li className="flex items-center gap-2">
							{ validation.is_uppercase_valid
								? <Check
									className="text-green-500"
									size="16"
								  />
								:
								<X
									className="text-red-500"
									size="16"
								/> }
							At least { passwordRules.uppercase_min } uppercase{ passwordRules.uppercase_min > 1 ? 's' : '' }
						</li>
						: null
				}
				{
					passwordRules.lowercase_min && passwordRules.lowercase_min > 0 ?
						<li className="flex items-center gap-2">
							{ validation.is_lowercase_valid
								? <Check
									className="text-green-500"
									size="16"
								  />
								:
								<X
									className="text-red-500"
									size="16"
								/> }
							At least { passwordRules.lowercase_min } lowercase{ passwordRules.lowercase_min > 1 ? 's' : '' }
						</li>
						: null
				}
				{
					passwordRules.numbers_min && passwordRules.numbers_min > 0 ?
						<li className="flex items-center gap-2">
							{ 
								validation.is_numbers_valid 
									? <Check
										className="text-green-500"
										size="16"
									  />
									:
									<X
										className="text-red-500"
										size="16"
									/>
						 }
							At least { passwordRules.numbers_min } number{ passwordRules.numbers_min > 1 ? 's' : '' }
						</li>
						: null
				}
				{
					passwordRules.symbols_min && passwordRules.symbols_min > 0 ?
						<li className="flex items-center gap-2">
							{
								validation.is_symbols_valid 
									? <Check
										className="text-green-500"
										size="16"
									  />
									:
									<X
										className="text-red-500"
										size="16"
									/>
							}
							At least { passwordRules.symbols_min } special char{ passwordRules.symbols_min > 1 ? 's' : '' }
						</li>
						: null
				}
				{
					passwordRules.min_length && passwordRules.min_length > 0 ?
						<li className="flex items-center gap-2">
							{
								validation.is_length_valid
									? <Check
										className="text-green-500"
										size="16"
									  />
									:
									<X
										className="text-red-500"
										size="16"
									/>
							}
							At least { passwordRules.min_length } characters
						</li>
						: null
				}
				{
					passwordRules.should_contain_unique_chars ?
						<li className="flex items-center gap-2">
							{
								validation.is_unique_chards_valid && value.length > 0
									? <Check
										className="text-green-500"
										size="16"
									  />
									:
									<X
										className="text-red-500"
										size="16"
									/>
							}
							Only unique characters
						</li>
						: null
				}
				
			</ul>
		</div>
	);
	
};

export default PasswordValidationCheckList;