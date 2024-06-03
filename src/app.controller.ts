import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SkipAuth } from './common/guards/skip-auth.guard';

@Controller('cc')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@SkipAuth()
	@ApiExcludeEndpoint()
	getHello(): string {
		return this.appService.getHello();
	}

	@Post()
	@SkipAuth()
	async sendMessage(@Body() token: string) {
		// const message = {
		// 	notification: {
		// 		title: 'Hello',
		// 		body: 'World'
		// 	},
		// 	token: 'ca_JLj68wt6hvvaS5xjJaz:APA91bEfhjwpz8q1s1La9Byx2dYlm51uTPXO6E1h4nh3hhKwIIo3Tii-GcOurincZjB2x0elXFXS9ZtBJDqqz0k9vuuqiO0ddY5Hef6yO76FemnIUjFSyNLz7f_9WdYo04_Oxd2pMHS7'
		// };
		// await firebase.messaging().send(message);

		this.appService.sendNotification();

		return 'success';
	}
}
