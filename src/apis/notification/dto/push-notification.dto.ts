import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PushNotificationDto {
	@ApiProperty({ description: 'Notification content' })
	@IsString()
	@IsNotEmpty()
	content!: string;
}
