export interface IDepartment {
	id: string;
	name: string;
	color: string;
	main: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface IDepartmentsResponse {
	count: number;
	data: IDepartment[];
}