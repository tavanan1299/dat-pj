import { ApiController, UseUserGuard } from '@app/common';
import {
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { randomBytes } from 'crypto';
import { StorageService } from './storage.service';

@Controller('storage')
@ApiController('Storage')
@UseUserGuard()
export class StorageController {
	constructor(private readonly storageService: StorageService) {}

	@ApiOperation({ summary: 'Upload image' })
	@ApiOkResponse({ description: 'Upload image successfully' })
	@ApiBody({
		schema: {
			type: 'object',
			required: ['file'],
			properties: {
				file: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	@ApiConsumes('multipart/form-data')
	@Post('upload/image')
	@UseInterceptors(FileInterceptor('file'))
	async uploadAvatar(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5000000 }),
					new FileTypeValidator({ fileType: new RegExp(/\/(jpg|jpeg|png)$/i) })
				]
			})
		)
		avatar?: Express.Multer.File
	) {
		if (avatar?.buffer) {
			const customFilename = `${randomBytes(16).toString('hex')}`;
			const result = await this.storageService.uploadAvatar(
				customFilename,
				avatar.buffer,
				avatar.mimetype
			);

			return result;
		}
		return null;
	}
}
