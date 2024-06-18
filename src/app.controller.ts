import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SkipAuth } from './common/guards/skip-auth.guard';

@Controller({ version: VERSION_NEUTRAL })
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@SkipAuth()
	@ApiExcludeEndpoint()
	getHello(): string {
		return this.appService.getHello();
	}
}
