const eosjs = require('eosjs');
// const mysql = require('mysql');
const  mysql = require('mysql2/promise');
const pMap = require('p-map');
const WebSocket = require('ws');
const colors = require('colors/safe');



class WatchActions {

	constructor() {

		var self = this;

		this.listen_for_account = 'eosdactokens';
		this.token_symbol = 'EOSDAC';

		this.deamonize = 3; //seconds, 0 is disabled
		this.offset = 99999999999999999; //this is a hack

		this.start_account_action_seq = 0;

		this.db_config = { host: "localhost", user: "root", password: "", database: "eosdac_explorer" };
		

		this.eos = eosjs({
			chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
			httpEndpoint: 'http://api.eossweden.se',
			//httpEndpoint: 'http://ex1.eosdac.io:8080',
		});
		console.log(colors.green('Connected to EOS network!') );

		this.enableSocketServer = false;

		if(!this.deamonize){
			this.loop();	
		}
		else{
			this.deamon();
		}
		

	}

	async deamon(){
		var self = this;
		if(this.db == undefined){
			this.db = await mysql.createConnection(this.db_config);
		}
		let sql = `SELECT account_action_seq FROM transfers WHERE confirmed = 1 ORDER BY account_action_seq DESC LIMIT 1`;
		var [rows, fields] = await self.db.execute(sql);
		if(rows[0] != undefined){
			self.start_account_action_seq = rows[0].account_action_seq+1;
		}
		else{
			self.start_account_action_seq = 0;
		}
		// console.log(self.start_account_action_seq)

		let actions = await self.getAllActions();

		await self._sleep(self.deamonize*1000)
		self.deamon();

	}

	getAllActions(){

		var self = this;
		return this.eos.getActions({account_name: this.listen_for_account ,pos:this.start_account_action_seq, offset: self.offset}).then( async function(a){
				// console.log(a)
				if(a.actions.length == 0){
					console.log(colors.green('No new actions')+ colors.yellow(`(latest: ${self.start_account_action_seq-1})`));
					return false;
				}

				console.log('Processing actions: '+ self.start_account_action_seq +' - '+(a.actions.length+self.start_account_action_seq -1) );
				a.actions.forEach(async function(x, i, arr){

					if(x.action_trace.receipt.receiver !== self.listen_for_account || x.action_trace.act.account !== self.listen_for_account){
						return;
					}

					let data = {};
					data.account_action_seq = x.account_action_seq;
					data.actiontype = x.action_trace.act.name;
					data.block_num = x.block_num;
					data.block_time =x.block_time;
					data.confirmed = false;

					if(data.block_num <= a.last_irreversible_block ){
						data.confirmed = true;
					}

					let new_balance_entry = {};
					new_balance_entry.account = '';
					new_balance_entry.balance = 0;
					new_balance_entry.is_member = 0;
					new_balance_entry.has_voted = 0;
					new_balance_entry.is_exchange = 0;

					switch (data.actiontype) {
						case 'transfer':
							data._from = x.action_trace.act.data.from;
							data._to = x.action_trace.act.data.to;
							let temp = x.action_trace.act.data.quantity.split(' ');
							data._quantity = temp[0];
							data._symbol = temp[1];
							data._memo = encodeURIComponent(x.action_trace.act.data.memo);
							data.txid = x.action_trace.trx_id;

							let sql = `INSERT INTO transfers SET ? ON DUPLICATE KEY UPDATE confirmed = ${data.confirmed}`;
							
							if(data.confirmed && (self.token_symbol === data._symbol) ){
								try{
									var [rows, fields] = await self.db.query(sql, data);
								}catch(e){
									console.log('error');
								}
							}
							
							break;

						case 'memberunreg':
							new_balance_entry.account = x.action_trace.act.data.sender;
							let sql = `INSERT INTO balances SET ? ON DUPLICATE KEY UPDATE is_member = 0`;
							try{
								var [rows, fields] = await self.db.query(sql, new_balance_entry);
							}catch(e){
								console.log('error');
							}
						case 'memberreg':
							new_balance_entry.account = x.action_trace.act.data.sender;
							let sql = `INSERT INTO balances SET ? ON DUPLICATE KEY UPDATE is_member = 1`;
							try{
								var [rows, fields] = await self.db.query(sql, new_balance_entry);
							}catch(e){
								console.log('error');
							}
						case 'votecust':
							new_balance_entry.account = x.action_trace.act.data.voter;
							if (x.action_trace.act.data.newvotes.count > 0) {
								new_balance_entry.has_voted = 1;
							} else {
								new_balance_entry.has_voted = 0;
							}
							let sql = `INSERT INTO balances SET ? ON DUPLICATE KEY UPDATE has_voted = ${new_balance_entry.has_voted}`;
							try{
								var [rows, fields] = await self.db.query(sql, new_balance_entry);
							}catch(e){
								console.log('error');
							}

						default:
							console.log(colors.red('Unknown Action!') );
					};

				});
				return true;
			
		})
		.catch(x => console.log(x) );
	}

	_sleep(t) {
		return new Promise(resolve => setTimeout(resolve, t));
	}


}//end class

test = new WatchActions();