export interface IEmailResponse {
	success: boolean;
	data: [
		{
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
		}
	];
	status: number;
	message?: string;
}

export interface IClassifyResponse {
	success: boolean;
	data: string;
	message: string;
	status: number;
}
