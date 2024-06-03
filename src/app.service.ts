import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { google } from 'googleapis';
import * as packageJson from 'packageJson';
import * as key from './modules/firebase/firebase-sdk.json';

@Injectable()
export class AppService {
	// constructor(
	// 	private readonly PROJECT_ID = 'trade-coin-dbb18',
	// 	private HOST = 'fcm.googleapis.com',
	// 	private PATH = '/v1/projects/' + PROJECT_ID + '/messages:send',
	// 	private MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging',
	// 	private SCOPES = [MESSAGING_SCOPE]
	// ) {
	// }

	getHello(): string {
		const name = packageJson.name;
		const version = packageJson.version;
		return `${name} v${version}`;
	}

	private getAccessToken() {
		return new Promise(function (resolve, reject) {
			const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
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

	private async AxiosConfig(token, notification) {
		console.log(token, 'token');
		try {
			const config = {
				method: 'post',
				url: 'https://fcm.googleapis.com/v1/projects/trade-coin-dbb18/messages:send',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				data: notification
			};

			const response = await axios(config);

			return response;
		} catch (error) {
			console.log('Error Send Noti', error);
			throw error;
		}
	}

	async sendNotification() {
		const access_token = await this.getAccessToken();
		const notification = JSON.stringify({
			message: {
				token: 'ca_JLj68wt6hvvaS5xjJaz:APA91bGlsIgTLpF8dggRgfb06tetU3yLwbP_Bu82_qcLiCvwdHsQles3a9noyUXuKNMHoaIzq-cWxBTPWIDl9dxGLQJ_1O71cMzdC4jTFXUpfrUyNDHk8gm_4fuSCAR4tDiu6LWayk5i',
				notification: {
					body: 'Testing',
					title: 'Testing'
				},
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
					productId: 'trade-coin-dbb18'
				}
			}
		});

		try {
			const response = await this.AxiosConfig(access_token, notification);
		} catch (error) {
			console.log('error', error);
		}
	}
}
