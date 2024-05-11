import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
	constructor(private readonly configService: ConfigService) {}

	private readonly s3Client = new S3Client({
		region: this.configService.get('AWS_S3_REGION')
	});

	async uploadAvatar(fileName: string, file: Buffer, contentType: string) {
		try {
			const key = `uploads/users/${String(fileName)}`;
			const data = await this.s3Client.send(
				new PutObjectCommand({
					Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
					Key: key,
					Body: file,
					ContentType: contentType
				})
			);
			if (data.$metadata.httpStatusCode === 200) {
				const resData = {
					data: {
						path: `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get('AWS_S3_REGION')}.amazonaws.com/${key}`
					}
				};
				return resData;
			}
		} catch (e: any) {
			throw new BadGatewayException({
				errorCodes: 'UPLOAD_AVATAR_FAIL',
				description: `Something wrong when upload avatar `
			});
		}
	}
}