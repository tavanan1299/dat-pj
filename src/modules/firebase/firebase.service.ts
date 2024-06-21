import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { google } from 'googleapis';
import * as key from '../../../firebase-sdk.json';

export type Notification = {
	title: string;
	body: string;
};

@Injectable()
export class FirebaseService {
	constructor(private configService: ConfigService) {}

	private getAccessToken() {
		return new Promise((resolve, reject) => {
			const MESSAGING_SCOPE = this.configService.get('MESSAGING_SCOPE');
			const SCOPES = [MESSAGING_SCOPE];
			const jwtClient = new google.auth.JWT(
				key.client_email,
				undefined,
				key.private_key,
				SCOPES,
				undefined
			);
			jwtClient.authorize(function (err, tokens) {
				if (err) {
					reject(err);
					return;
				}
				resolve(tokens!.access_token);
			});
		});
	}

	private async AxiosConfig(token: string, notification: string) {
		const projectId = this.configService.get('PRODUCT_ID');
		try {
			const config = {
				method: 'post',
				url: `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				data: notification
			};

			const response = await axios(config);

			return response;
		} catch (error) {
			throw error;
		}
	}

	async sendNotification(fcmToken: string, dataNoti: Notification) {
		const access_token = (await this.getAccessToken()) as string;
		const notification = JSON.stringify({
			message: {
				token: fcmToken,
				// notification: {
				// 	...dataNoti
				// },
				apns: {
					headers: {
						'apns-priority': '10'
					},
					payload: {
						aps: {
							sound: 'default'
						}
					}
				},
				data: {
					productId: this.configService.get('PRODUCT_ID'),
					...dataNoti
				}
			}
		});

		try {
			await this.AxiosConfig(access_token, notification);
		} catch (error) {
			console.log('error', error);
		}
	}
}
