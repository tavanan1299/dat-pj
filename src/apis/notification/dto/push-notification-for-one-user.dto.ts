import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PushNotificationForOneUser {
	@ApiProperty({ description: 'Notification content' })
	@IsString()
	@IsNotEmpty()
	content!: string;

	@ApiProperty({ description: 'User id' })
	@IsString()
	@IsNotEmpty()
	userId!: string;
}
