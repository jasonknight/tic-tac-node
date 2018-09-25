var Game = {};
Game.UNOWNED = -1;
Game.P1 = 0;
Game.P2 = 1;
Game.createSquare = function (y,x) {
	return {
		owner: Game.UNOWNED,
		display: '_',
		x: x,
		y: y
	};
}
Game.createBoard = function (size) {
	var b = [];
	for ( var y = 0; y < size; y++) {
		var r = []
		for ( var x = 0; x < size; x++ ) {
			r.push(Game.createSquare(y,x));
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
Game.display = function (board) {
	function puts(ln) {
		process.stdout.write(ln);
	}
	for ( var y = 0; y < board.length; y++ ) {
		puts(board[y].map(function (s) { 
			return s.display; 
		}).join("|") + "\n");
	}
	puts("\n");
}
Game.aiBlockRow = function (board,y) {
	for ( var x = 0; x < board.length; x++ ) {
		if ( board[y][x].owner == Game.UNOWNED ) {
			return Game.play(board,Game.P2,y,x);
		}
	}	
	return board;
}
Game.aiBlockCol = function (board,x) {
	for ( var y = 0; y < board.length; y++ ) {
		if ( board[y][x].owner == Game.UNOWNED ) {
			return Game.play(board,Game.P2,y,x);
		}
	}	
	return board;
}
Game.aiBlockDiag = function (board,i) {
	var x = 0;
	if ( i == -1 ) { x = board.length - 1; }
	for ( var y = 0; y < board.length; y++ ) {
		if ( board[y][x].owner == Game.UNOWNED ) {
			return Game.play(board,Game.P2,y,x);
		}
		if ( i == -1 ) { x--; } else { x++; }
	}
	return board;
}
Game.aiPlay = function (board) {
	// First, let's see if we can win in 1 move
	for ( var y = 0; y < board.length; y++ ) {
		var sqs = Game.getRowByPlayer(board,Game.P2,y);
		if ( sqs.length == board.length - 1 ) {
			return Game.aiBlockRow(board,y);
		}
	}
	for ( var x = 0; x < board.length; x++ ) {
		var sqs = Game.getColByPlayer(board,Game.P2,x);
		if ( sqs.length == board.length - 1 ) {
			return Game.aiBlockCol(board,x);
		}
	}
	for ( var i = -1; i < 1; i++ ) {
		var sqs = Game.getDiagByPlayer(board,Game.P2,i);
		if ( sqs.length == board.length - 1 ) {
			return Game.aiBlockDiag(board,i);
		}
	}
	// Secondly we need to block
	for ( var y = 0; y < board.length; y++ ) {
		var sqs = Game.getRowByPlayer(board,Game.P1,y);
		if ( sqs.length == board.length - 1 ) {
			return Game.aiBlockRow(board,y);
		}
	}
	for ( var x = 0; x < board.length; x++ ) {
		var sqs = Game.getColByPlayer(board,Game.P1,x);
		if ( sqs.length == board.length - 1 ) {
			return Game.aiBlockCol(board,x);
		}
	}
	for ( var i = -1; i < 1; i++ ) {
		var sqs = Game.getDiagByPlayer(board,Game.P1,i);
		if ( sqs.length == board.length - 1 ) {
			return Game.aiBlockDiag(board,i);
		}
	}
	// We need a state machine
	var direction = 0; // 0 = row, 1 = column 2 = diag
	var row = 0;
	var col = 0;
	var dia = -1;
	var row_sqs = Game.getRowByPlayer(board,Game.P2,row);
	for ( var y = 1; y < board.length; y++ ) {
		var sqs2 = Game.getRowByPlayer(board,Game.P2,y);
		if ( sqs2.length > row_sqs.length ) {
			row = y;
			row_sqs = sqs2;
		}
	}
	var col_sqs = Game.getColByPlayer(board,Game.P2,col);
	for ( var x = 1; x < board.length; x++ ) {
		var sqs2 = Game.getColByPlayer(board,Game.P2,x);
		if ( sqs2.length > col_sqs.length ) {
			col = x;
			col_sqs = sqs2;
		}
	}
	var dia_sqs = Game.getDiagByPlayer(board,Game.P2,dia);
	for ( var i = -1; i < 1; i++ ) {
		var sqs2 = Game.getDiagByPlayer(board,Game.P2,i);
		if ( sqs2.length > dia_sqs.length ) {
			dia = i;
			dia_sqs = sqs2;
		}
	}
	if ( col_sqs.length > row_sqs.length ) {
		if ( col_sqs.length > dia_sqs.length ) {
			direction = 1;	
		} else {
			direction = -1;	
		}
	}
	if ( dia_sqs.length > row_sqs.length ) {
		if ( dia_sqs.length > col_sqs.length ) {
			direction = -1;
		} else {
			direction = 1;
		}
	}
	switch(direction) {
		case 1: {
			// The we should go with a col
			var sq = Game.getColByPlayer(board,Game.UNOWNED,col).pop();
			return Game.play(board,Game.P2,sq.y,sq.x);
		}
		break;
		case 2: {
			// The we should go with a diag
			var sq = Game.getDiagByPlayer(board,Game.UNOWNED,dia).pop();
			return Game.play(board,Game.P2,sq.y,sq.x);

		}
		break;
		default: {
			// we go with a row
			var sq = Game.getRowByPlayer(board,Game.UNOWNED,row).pop();
			return Game.play(board,Game.P2,sq.y,sq.x);
		}
		break;
	}
	return board;
}
for ( var k in Game ) {
	exports[k] = Game[k];
}
