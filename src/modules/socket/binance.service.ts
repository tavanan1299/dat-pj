import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import WebSocket from 'ws';

@Injectable()
export class BinanceService {
	initWebSocket(server: Server) {
		const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@markPrice');

		ws.onmessage = (event) => {
			console.log(JSON.parse(event.data));
		};

		ws.on('error', (error) => {
			console.error(`WebSocket error: ${error.message}`);
		});
	}
}
