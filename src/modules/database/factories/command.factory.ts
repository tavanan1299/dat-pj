import { CommandEntity } from '@app/apis/command/entities/command.entity';
import { CommandType } from '@app/common/enums/status.enum';
import { setSeederFactory } from 'typeorm-extension';

const coinNames = [
	'btc',
	'eth',
	'ltc',
	'bch',
	'bnb',
	'eos',
	'xrp',
	'xlm',
	'link',
	'dot',
	'yfi',
	'uni',
	'ada',
	'doge',
	'vet',
	'theta',
	'trx',
	'xmr',
	'xtz',
	'atom',
	'algo',
	'aave',
	'comp',
	'snx',
	'leo',
	'celo',
	'usdt',
	'usdc',
	'busd',
	'dai',
	'ht',
	'okb',
	'cro',
	'matic',
	'ftm',
	'chz',
	'sushi',
	'cake',
	'mana',
	'enj',
	'bat',
	'zil',
	'stmx',
	'ocean',
	'sand',
	'rune',
	'ankr',
	'crv',
	'1inch',
	'avax',
	'axs',
	'hbar',
	'iotx',
	'ksm',
	'luna',
	'mir',
	'near',
	'omg',
	'paxg',
	'qnt',
	'rose',
	'sol',
	'tomo',
	'uma',
	'utk',
	'waves',
	'xem',
	'zen',
	'zil',
	'zrx',
	'band',
	'bal',
	'bnt',
	'bzrx',
	'clv',
	'ctxc',
	'dag',
	'dgb',
	'dodo',
	'dusk',
	'egld',
	'elf',
	'fet',
	'grt',
	'hive',
	'hnt',
	'kava',
	'kmd',
	'knc',
	'lrc',
	'mkr',
	'mln',
	'mtl',
	'nano',
	'ogn',
	'poly',
	'psg',
	'pundix',
	'qkc',
	'reef'
];

function getRandomElement(arr) {
	const randomIndex = Math.floor(Math.random() * arr.length);
	return arr[randomIndex];
}

export const CommandsFactory = setSeederFactory(CommandEntity, () => {
	const commandType = getRandomElement([CommandType.BUY, CommandType.SELL]);
	const expectPrice = Math.floor(Math.random() * 100000);

	const command = new CommandEntity();
	command.coinName = getRandomElement(coinNames);
	command.expectPrice = expectPrice;
	command.quantity = Math.floor(Math.random() * 1000);
	command.type = commandType;
	command.totalPay = Math.floor(Math.random() * 100000);
	command.userId = 'a1e9ce39-cf45-4871-8541-cfa73ef97559';

	if (commandType === CommandType.SELL) {
		command.lossStopPrice = Math.floor(Math.random() * expectPrice);
	}
	return command;
});
