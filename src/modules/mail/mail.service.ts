import { MetadataKey } from '@common';
import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getOtpTemplate, getTransferTemplate } from './mail.helper';
import { IMailService } from './mail.interface';

@Injectable()
export class MailService extends IMailService {
	constructor(
		@Inject(MetadataKey.NODEMAILER)
		private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>
	) {
		super();
	}

	private async sendMail(payload: SendMailPayload) {
		return this.transporter.sendMail(payload);
	}

	async sendOTP(payload: SendOTPPayload) {
		const template = getOtpTemplate(payload);
		return this.sendMail({
			...payload,
			subject: 'Verify Account',
			html: template
		});
	}

	async sendTransfer(payload: SendTransferPayload) {
		const template = getTransferTemplate(payload);
		return this.sendMail({
			...payload,
			subject: 'Remind transaction',
			html: template
		});
	}
}
