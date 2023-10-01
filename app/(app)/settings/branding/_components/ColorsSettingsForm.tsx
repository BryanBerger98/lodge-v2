'use client';

import { CircleDot } from 'lucide-react';

import ButtonList from '@/components/ui/Button/ButtonList';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ColorsSettingsForm = () => {

	const handleClick = () => {
		console.log('Hello world');
	};

	return (
		<>
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Colors</CardTitle>
					<CardDescription>Add the colors of your business.</CardDescription>
				</CardHeader>
				<CardContent>
					<ButtonList>
						<ButtonItem
							value={
								<span
									className="flex items-center gap-2"
								>
									<CircleDot
										className="text-blue-500"
										size="16"
									/>
									#3B82F6
								</span>
							}
							onClick={ handleClick }
						>
							Primary
						</ButtonItem>
						<ButtonItem
							value={
								<span
									className="flex items-center gap-2"
								>
									<CircleDot
										className="text-slate-500"
										size="16"
									/>
									#64748B
								</span>
							}
							onClick={ handleClick }
						>
							Secondary
						</ButtonItem>
						<ButtonItem
							value={
								<span
									className="flex items-center gap-2"
								>
									<CircleDot
										className="text-yellow-500"
										size="16"
									/>
									#EAB308
								</span>
							}
							onClick={ handleClick }
						>
							Warning
						</ButtonItem>
						<ButtonItem
							value={
								<span
									className="flex items-center gap-2"
								>
									<CircleDot
										className="text-red-500"
										size="16"
									/>
									#EF4444
								</span>
							}
							onClick={ handleClick }
						>
							Danger
						</ButtonItem>
						<ButtonItem
							value={
								<span
									className="flex items-center gap-2"
								>
									<CircleDot
										className="text-green-500"
										size="16"
									/>
									#22C55E
								</span>
							}
							onClick={ handleClick }
						>
							Success
						</ButtonItem>
						<ButtonItem
							value={
								<span
									className="flex items-center gap-2"
								>
									<CircleDot
										className="text-cyan-500"
										size="16"
									/>
									#06B6D4
								</span>
							}
							onClick={ handleClick }
						>
							Info
						</ButtonItem>
						<ButtonItem
							value={
								<span
									className="flex items-center gap-2"
								>
									<CircleDot
										className="text-slate-50"
										size="16"
									/>
									#F8FAFC
								</span>
							}
							onClick={ handleClick }
						>
							Light
						</ButtonItem>
						<ButtonItem
							value={
								<span
									className="flex items-center gap-2"
								>
									<CircleDot
										className="text-slate-900"
										size="16"
									/>
									#0F172A
								</span>
							}
							onClick={ handleClick }
						>
							Dark
						</ButtonItem>
					</ButtonList>
				</CardContent>
			</Card>
		</>
	);
};

export default ColorsSettingsForm;