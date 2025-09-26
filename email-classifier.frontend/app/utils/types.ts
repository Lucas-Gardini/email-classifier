export interface IEmailResponse {
	success: boolean;
	data: {
		items: {
			_id: string;
			subject: string;
			sender: string;
			body: string;
			status: string;
			classification: string;
			createdAt: string;
			updatedAt: string;
			suggestion: {
				suggestedResponse: string;
				summary: string;
			};
		}[];
		total: number;
		page: number;
		limit: number;
	};
	status: number;
	message?: string;
}

export interface IClassifyResponse {
	success: boolean;
	data: string;
	message: string;
	status: number;
}

export interface IFilters {
	id: string;
	subject: string;
	sender: string;
	body: string;
	status: string;
	page: number;
	limit: number;
}
