export enum StackingStatus {
	PENDING = 'pending',
	DONE = 'done'
}

export enum CommandType {
	BUY = 'buy',
	SELL = 'sell'
}

export enum CommonStatus {
	FAIL = 'fail',
	SUCCESS = 'success'
}

export enum MarketLogType {
	MARKET_BUY = 'market_buy',
	MARKET_SELL = 'market_sell',
	COMMAND_SELL = 'command_sell',
	COMMAND_BUY = 'command_buy'
}

export enum FutureCommandType {
	LIMIT = 'limit',
	MARKET = 'market'
}
