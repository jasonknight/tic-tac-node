var assert = require('assert');
var Game = require('../game');
describe('Game', function () {
	describe('createBoard', function() {
		it('should create board', function () {
			var size = 3;
			var board = Game.createBoard(size);
			assert.equal(board.length, size);
			assert.equal(board[0].length, size);
			assert.equal(board[0][0].owner,Game.UNOWNED);
		});
	});
	describe('unplayed', function () {
		it('should return unplayed',function() {
			var size = 3;
			var board = Game.createBoard(size);
			assert.equal(Game.unplayed(board).length, size * size);
		});	
	});
	describe('play',function () {
		it('should play a square',function() {
			var size = 3;
			var board = Game.createBoard(size);
			board = Game.play(board,Game.P1,0,0);
			assert.equal(board[0][0].owner, Game.P1);
			assert.equal(board[0][0].display, 'O');
			assert.equal(Game.getRowByPlayer(board,Game.P1,0).length,1);
			assert.equal(Game.getColByPlayer(board,Game.P1,0).length,1);
			assert.equal(Game.getDiagByPlayer(board,Game.P1,0).length,1);
		});
		it('should return diag with center',function() {
			var size = 3;
			var board = Game.createBoard(size);
			board = Game.play(board,Game.P1,1,1);
			assert.equal(Game.getDiagByPlayer(board,Game.P1,-1).length,1);
			assert.equal(Game.getDiagByPlayer(board,Game.P1,0).length,1);
		});
		it('should return bottom left diag',function() {
			var size = 3;
			var board = Game.createBoard(size);
			board = Game.play(board,Game.P1,2,0);
			assert.equal(Game.getDiagByPlayer(board,Game.P1,-1).length,1);
		});	
	});
	describe('winning',function() {
		it('should find winning rows',function () {
			var size = 3;
			for ( var y = 0; y < size; y++ ) {
				var board = Game.createBoard(size);
				for ( var x = 0; x < size; x++ ) {
					board = Game.play(board,Game.P1,y,x);
				}
				Game.display(board);
				assert.equal(Game.isWon(board),true);
			}
		});	
		it('should find winning columns',function () {
			var size = 3;
			for ( var x = 0; x < size; x++ ) {
				var board = Game.createBoard(size);
				for ( var y = 0; y < size; y++ ) {
					board = Game.play(board,Game.P1,y,x);
				}
				Game.display(board);
				assert.equal(Game.isWon(board),true);
			}
		});
		it('should find winning diags',function () {
			var size = 3;
			for ( var dir = -1; dir < 1; dir++ ) {
				var board = Game.createBoard(size);
				var x = 0;
				if ( dir == -1 ) { x = board.length - 1; }
				for ( var y = 0; y < board.length; y++ ) {
					board = Game.play(board,Game.P1,y,x);
					if ( dir == -1 ) { x--; } else { x++; }
				}
				Game.display(board);
				assert.equal(Game.isWon(board),true);
			}
		});
	});
	describe('generic ai',function () {
		it('should block winning rows',function() {
			var size = 3;
			for ( var y = 0; y < size; y++) {
				var board = Game.createBoard(size);
				for ( var x = 0; x < size - 1; x++ ) {
					board = Game.play(board,Game.P1,y,x);
				}
				board = Game.aiPlay(board)
				var sqs = Game.getRowByPlayer(board,Game.P2,y);
				assert.equal(sqs.length,1);
				Game.display(board);
				sqs = Game.getRowByPlayer(board,Game.P1,y);
				assert.equal(sqs.length,size-1);
			}		
		});
		it('should block winning cols',function() {
			var size = 3;
			for ( var x = 0; x < size; x++) {
				var board = Game.createBoard(size);
				for ( var y = 0; y < size - 1; y++ ) {
					board = Game.play(board,Game.P1,y,x);
				}
				board = Game.aiPlay(board)
				var sqs = Game.getColByPlayer(board,Game.P2,x);
				Game.display(board);
				assert.equal(sqs.length,1);
				sqs = Game.getColByPlayer(board,Game.P1,x);
				assert.equal(sqs.length,size-1);
			}		
		});
		it('should block winning diag',function() {
			var size = 3;
			for ( var i = -1; i < 1; i++ ) {
				var board = Game.createBoard(size);
				var x = 0;
				if ( i == -1 ) { x = board.length - 1; }
				for ( var y = 0; y < board.length-1; y++ ) {
					board = Game.play(board,Game.P1,y,x);	
					if ( i == -1 ) { x--; } else { x++; }
				}
				board = Game.aiPlay(board);
				var sqs = Game.getDiagByPlayer(board,Game.P2,i);
				assert.equal(sqs.length,1);
				Game.display(board);
			}		
		});	
		it('should stick to a row',function() {
			var size = 4;
			for ( var y = 0; y < size; y++ ) {
				var board = Game.createBoard(size);
				for ( var x = 0; x < size - 2; x++ ) {
					board = Game.play(board,Game.P2,y,x);
				}
				board = Game.aiPlay(board);
				Game.display(board);
				var sqs = Game.getRowByPlayer(board,Game.P2,y);
				assert.ok(sqs.length == size -1)
			}	
		});
	});
});
