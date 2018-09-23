var Game = {};
Game.UNOWNED = -1;
Game.P1 = 0;
Game.P2 = 1;
Game.createSquare = function () {
	return {
		owner: Game.UNOWNED,
		display: '_'
	};
}
Game.createBoard = function (size) {
	var b = [];
	for ( var y = 0; y < size; y++) {
		var r = []
		for ( var x = 0; x < size; x++ ) {
			r.push(Game.createSquare());
		}
		b.push(r);
	}
	return b;
}
Game.unplayed = function (board) {
	var b = [];
	var size = board.length;
	for ( var y = 0; y < size; y++) {
		for ( var x = 0; x < size; x++ ) {
			if ( board[y][x].owner == Game.UNOWNED ) {
				b.push(Game.createSquare());
			}
		}
	}
	return b;
}
Game.play = function (board,player,y,x) {
	board[y][x].owner = player
	board[y][x].display = player == Game.P1 ? 'O': 'X';
	return board
}
Game.getRowByPlayer = function (board, player, y) {
	var r = [];
	for ( var x = 0; x < board.length; x++ ) {
		var s  = board[y][x];
		if ( s.owner == player ) {
			r.push(s);
		}	
	}	
	return r;
}
Game.getColByPlayer = function (board,player,x) {
	var r = [];
	for ( var y = 0; y < board.length; y++ ) {
		var s  = board[y][x];
		if ( s.owner == player ) {
			r.push(s);
		}
	}
	return r;
}
Game.getDiagByPlayer = function (board,player,dir) {
	var r = [];
	var x = 0;
	if ( dir == -1 ) { x = board.length - 1; }
	for ( var y = 0; y < board.length; y++ ) {
		var s  = board[y][x];
		if ( s.owner == player ) {
			r.push(s);
		}
		if ( dir == -1 ) { x--; } else { x++; }
	}
	return r;
}
Game.isWon = function(board) {
	// test rows
	for ( var y = 0; y < board.length; y++ ) {
		if ( Game.getRowByPlayer(board,Game.P1,y).length == board.length) {
			return true
		}
		if ( Game.getRowByPlayer(board,Game.P2,y).length == board.length) {
			return true
		}
	}
	// test cols
	for ( var x = 0; x < board.length; x++ ) {
		if ( Game.getColByPlayer(board,Game.P1,x).length == board.length) {
			return true
		}
		if ( Game.getRowByPlayer(board,Game.P2,x).length == board.length) {
			return true
		}
	}	
	for ( var i = -1; i < 1; i++ ) {
		if ( Game.getDiagByPlayer(board,Game.P1,i).length == board.length ) {
			return true;
		}
		if ( Game.getDiagByPlayer(board,Game.P2,i).length == board.length ) {
			return true;
		}
	}
	return false;
}

for ( var k in Game ) {
	exports[k] = Game[k];
}
