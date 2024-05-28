declare global {
	type SendMailPayload = {
		to: string;
		subject?: string;
		html?: string;
	};

	type GetOTPTemplatePayload = {
		otp: string;
		expiresInMinute: number;
	};

	type GetTransferTemplatePayload = {
		coinName: string;
		quantity: number;
		type: string;
		userId: string;
		email: string;
	};

	type SendOTPPayload = SendMailPayload & GetOTPTemplatePayload;

	type SendTransferPayload = SendMailPayload & GetTransferTemplatePayload;
}

export {};
