export function coinName2USDT(name: string) {
	return `${name.toUpperCase()}USDT`;
}

export function USDT2CoinName(name: string) {
	return name.replaceAll('USDT', '').toLowerCase();
}
