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
				assert.equal(Game.isWon(board),true);
			}
		});
	});
});
