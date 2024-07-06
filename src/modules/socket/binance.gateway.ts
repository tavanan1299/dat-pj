import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BinanceService } from './binance.service';

@WebSocketGateway()
export class BinanceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	constructor(private readonly binanceService: BinanceService) {}

	async afterInit() {
		// await this.binanceService.getCurrentListenCoin();
		// console.log('WebSocket Gateway Initialized');
		// this.binanceService.initWebSocket();
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}
}
