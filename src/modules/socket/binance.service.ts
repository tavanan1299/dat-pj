import { CommandEntity } from '@app/apis/command/entities/command.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { EntityManager } from 'typeorm';
import WebSocket from 'ws';

@Injectable()
export class BinanceService {
	private coins: string[] = [];
	constructor(
		@InjectQueue('binance:coin')
		private readonly binanceCoin: Queue,
		private readonly entityManager: EntityManager
	) {}

	initWebSocket() {
		const ws = new WebSocket(`wss://fstream.binance.com/ws/${this.coins.join('/')}`);

		ws.onmessage = (event) => {
			this.binanceCoin.add('coinPrice', JSON.parse(event.data));
			// console.log(JSON.parse(event.data));
		};

		ws.on('error', (error) => {
			console.error(`WebSocket error: ${error.message}`);
		});
	}

	@OnEvent('command.created')
	addCoin(coin: string): void {
		const binanceCoin = `${coin}usdt@markPrice`;

		if (!this.coins.includes(binanceCoin)) {
			this.coins.push(binanceCoin);
			this.initWebSocket();
		}
	}

	async getCurrentListenCoin() {
		const data = await this.entityManager
			.getRepository(CommandEntity)
			.createQueryBuilder('command')
			.select('command.coinName')
			.distinctOn(['command.coinName'])
			.getMany();

		this.coins = data.map((item) => `${item.coinName}usdt@markPrice`);
		return;
	}
}
