import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { useSwagger } from './app.swagger';

async function bootstrap() {
	const logger = new Logger('Bootstrap');
	const app = await NestFactory.create(AppModule, {
		logger: ['error', 'debug', 'verbose']
	});
	const configService = app.get<ConfigService>(ConfigService);
	const port = configService.get<string>('PORT') || 3000;
	const nodeEnv = configService.get<string>('NODE_ENV');

	app.enableCors({
		origin: true,
		credentials: true
	});

	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: {
				enableImplicitConversion: true
			}
		})
	);
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1'
	});
	useSwagger(app);

	await app.listen(port).then(async () => {
		const url = await app.getUrl();
		logger.debug(`Your app is running on port ${port}`);
		logger.debug(`Environment: ${nodeEnv}`);
		logger.debug(`Documentation ${url}/docs`);
	});
}
bootstrap();
