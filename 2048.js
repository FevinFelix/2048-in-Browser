const board = document.querySelector('.board')
const scoreBoard = document.querySelector('.score')
const gameover = document.querySelector('.gameOver')

let tiles; 
let previousTiles;
let score;
let previousScore;

start();

/**
 * Hide the game over screen.
 * Initializes tiles, previousTiles, score, and previousScore.
 * Generates two tiles.
 * Renders the board.
 */
function start() {
    gameover.classList.remove('show')

    tiles = new Array(4);

    for (let r = 0; r < 4; r++){	//changes tiles into a 2d array
        tiles[r] = new Array(4);
    }

    for (let r = 0; r < tiles.length; r++)	//initially sets all tiles to 0
		{
			for (let c = 0; c < tiles[0].length; c++)
			{
				tiles[r][c] = 0
			}
		}

   generateTile();
   generateTile();

   previousTiles = new Array(4);

   for (let r = 0; r < 4; r++){		// makes previous tiles a 2d array
    previousTiles[r] = new Array(4);
   }

    for (let r = 0; r < previousTiles.length; r++)	//copies tiles into previous tiles
		{
			for (let c = 0; c < previousTiles[0].length; c++)
			{
				previousTiles[r][c] = 0
			}
		}

   score = 0;
   previousScore = 0;

   render()
}

// Call control whenever a key is pressed.
window.addEventListener('keydown', e => {
    control(e)
})


/**
 * Moves in a direction or undoes an action based 
 *   on e.key.
 * 
 * Generates a new tile if the board changed and 
 *  isn't full.
 * 
 * Renders the board.
 * 
 * Reveals the game over screen if the game is over.
 * @param {*} e 
 */
function control(e) {

    if(gameOver())
        gameover.classList.add("show")

    if(e.key == "u")
        undo()
    else
        move(e.key)
	
    if(changed() && !full())
        generateTile()

    render()
}

/**
 * Returns true if tiles is full; false otherwise.
 * tiles is considered full if it doesn't contain a 0.
 */
function full() {
    for (let r = 0; r < tiles.length; r++)
    {
        for (let c = 0; c < tiles[0].length; c++)
        {
            if (tiles[r][c] == 0)
                return false;
        }
    }

    return true;
}

/**
 * Inserts a tile into a randomly selected empty spot in tiles.
 * 80% chance to generate a '2' tiles
 * 20% chance to generate a '4' tile
 */
function generateTile() {
    let starters = [2,2,2,2,2,2,2,2,4,4]; // 80% chance of 2 and 20% chance of 4
		let randomTile = Math.floor((Math.random() * 10));
		let added = false;
        let row = Math.floor((Math.random() * 4));
        let column = Math.floor((Math.random() * 4));

        while(!added)
        {
            if(tiles[row][column] == 0)
            {
                tiles[row][column] = starters[randomTile]
                added = true
            }
			else 
			{
				row = Math.floor((Math.random() * 4));
        		column = Math.floor((Math.random() * 4));
			}
        }
}

/**
 * Saves the elements from tiles into previousTiles.
 * Moves in the specified direction by delegating the
 *   move to moveVertical or moveHorizontal.
 * @param {*} direction 
 */
function move(direction) {
    for(let r = 0; r < tiles.length; r++)
    {
        for(let c = 0; c < tiles[0].length; c++)
        {
            previousTiles[r][c] = tiles[r][c]
        }
    }

	previousScore = score;

    if(direction == "ArrowLeft" || direction == "ArrowRight")
    {
        moveHorizontal(direction)
    }
    else if(direction == "ArrowUp" || direction == "ArrowDown")
    {
        moveVertical(direction)
    }
}

/**
 * Moves tiles in the specified horizontal direction.
 * 
 * Equal adjacent pairs of tiles in the same row will 
 *   be combined.
 * When tiles are combined, score will increase by
 *  an amount equal to the new tile that was created.
 * 
 * @param {*} direction true if moving right; false otherwise
 */
function moveHorizontal(direction) {
    if (direction == 'ArrowLeft')
    {
        let nums = new Array();
		let row = -1;

		for (let r = 0; r < tiles.length; r++)
		{
			for (let c = 0; c < tiles[0].length; c++)
			{
				nums.push(tiles[r][c]);	//fills nums with one row of board's values
			}

			while (nums.indexOf(0) !== -1)
				nums.splice(nums.indexOf(0), 1);
     
			while (nums.length < 4)
				nums.push(0);
    

			for (let i = 0; i < 3; i++) //checks nums from right to left since a left move combines from left to right
			{
				if (nums[i] == nums[i + 1])	// if the adjacent numbers match then add them up into one number
				{
					nums[i] = nums[i] + nums[i + 1];
					score += nums[i];
					nums.splice(i + 1, 1);
					nums.push(0);
				}
			}

			row++;
			let numsSpot = 0; // place in the ArrayList nums

			for (let c = 0; c < tiles[0].length; c++)
			{
				tiles[row][c] = nums[numsSpot];
				numsSpot++;
			}

			nums = new Array();
		}
    }
    else if (direction == 'ArrowRight')
    {
        let nums = new Array();
		let row = -1;

		for (let r = 0; r < tiles.length; r++)
		{
			for (let c = 0; c < tiles.length; c++)
			{
				nums.push(tiles[r][c]);	//fills nums with one row of board's values
			}

			while (nums.indexOf(0) !== -1)
				nums.splice(nums.indexOf(0), 1);
       
			while (nums.length < 4)
				nums.unshift(0);
         

			for (let i = 3; i > 0; i--) //checks nums from right to left since a left move combines from left to right
			{
				if (nums[i] == nums[i - 1])	// if the adjacent numbers match then add them up into one number
				{
					nums[i] = nums[i] + nums[i - 1];
					score += nums[i];
					nums.splice(i - 1, 1);
					nums.unshift(0);
				}
			}

			row++;
			let numsSpot = 0; // place in the ArrayList nums

			for (let c = 0; c < tiles[0].length; c++)
			{
				tiles[row][c] = nums[numsSpot];
				numsSpot++;
			}

			nums = new Array();
		}
    }
}

/**
 * Moves tiles in the specified horizontal direction.
 * 
 * Equal adjacent pairs of tiles in the same column will 
 *   be combined.
 * When tiles are combined, score will increase by
 *  an amount equal to the new tile that was created.
 * 
 * @param {*} direction true if moving down; false otherwise 
 */
function moveVertical(direction) {
    if (direction == 'ArrowUp')
    {
        let nums = new Array();
		let col = -1;

		for (let c = 0; c < tiles[0].length; c++)
		{
			for (let r = 0; r < tiles.length; r++)
			{
				nums.push(tiles[r][c]);	//fills nums with one column of board's values
			}

			while (nums.indexOf(0) !== -1)
				nums.splice(nums.indexOf(0), 1);

			while (nums.length < 4)
				nums.push(0);

			for (let i = 0; i < 3; i++) //checks nums from left to right since an up move is basically a left move
			{
				if (nums[i] == nums[i + 1])	// if the adjacent numbers match then add them up into one number
				{
					nums[i] = nums[i] + nums[i + 1];
					score += nums[i];
					nums.splice(i + 1, 1);
					nums.push(0);
				}
			}

			col++;
			let numsSpot = 0; // place in the ArrayList nums

			for (let row = 0; row < tiles.length; row++)
			{
				tiles[row][col] = nums[numsSpot];
				numsSpot++;
			}

			nums = new Array();
		}
    }
    else if (direction == 'ArrowDown')
    {
        let nums = new Array();
		let col = -1;

		for (let c = 0; c < tiles[0].length; c++)
		{
			for (let r = 0; r < tiles.length; r++)
			{
				nums.push(tiles[r][c]);	//fills nums with one column of board's values
			}

			while (nums.indexOf(0) !== -1)
				nums.splice(nums.indexOf(0), 1);

			while (nums.length < 4)
				nums.unshift(0);

			for (let i = 3; i > 0; i--) //checks nums from right to left since an up move is basically a right move
			{
				if (nums[i] == nums[i - 1])	// if the adjacent numbers match then add them up into one number
				{
					nums[i] = nums[i] + nums[i - 1];
					score += nums[i];
					nums.splice(i - 1, 1);
					nums.unshift(0);
				}
			}

			col++;
			let numsSpot = 0; // place in the ArrayList nums

			for (let row = 0; row < tiles.length; row++)
			{
				tiles[row][col] = nums[numsSpot];
				numsSpot++;
			}

			nums = new Array();
		}
    }
}

/**
 * Undo the last action by saving previousTiles back
 *  into tiles and previousScore back into score;
 */
function undo() {
    for (let r = 0; r < tiles.length; r++)
		{
			for (let c = 0; c < tiles[0].length; c++)
			{
				tiles[r][c] = previousTiles[r][c]
			}
		}

    score = previousScore
}

/**
 * Returns true if tiles and previousTiles contain 
 *   different elements; false otherwise.
 */
function changed() {

    for (let r = 0; r < tiles.length; r++)
		{
			for (let c = 0; c < tiles[0].length; c++)
			{
                if(tiles[r][c] !== previousTiles[r][c])
                return true;
			}
		}
    return false
}

/**
 * Returns true if the game is over; false otherwise
 * The game is over if the board is full and no adjacent
 *   tiles can be combined.
 */
function gameOver() {
	
	if (full()) {
		move('ArrowLeft')
		if(changed())
		{
			undo()
			return false;
		}

		move('ArrowRight')
		if(changed())
		{
			undo()
			return false;
		}

		move('ArrowUp')
		if(changed())
		{
			undo()
			return false;
		}

		move('ArrowDown')
		if(changed())
		{
			undo()
			return false;
		}
		
		return true;
	}
}

/**
 * Render the board by looping through tiles, creating
 *  a div for each tile with the class 'tile' and appending
 *  it to board.
 */
function render() {
    // Clear the current board

    while(board.firstChild)
    {
        board.removeChild(board.firstChild)
    }

    // Loop through tiles
            // Create a div element called tile
            // Assign the value to tile
            // Assign a font size to tile
            // Assign a color to tile
            // Add 'tile' to tile's class list
            // Append tile to board

    for (let r = 0; r < tiles.length; r++)
        {
            for (let c = 0; c < tiles[0].length; c++)
                {
                    let tile = document.createElement("div")
                    tile.innerText = tiles[r][c]
                    tile.classList.add("tile")
                    if(tile.innerText == 0)
                        tile.classList.add("noShow")
                    if(getBaseLog(2, tile.innerText) == 1)
                        tile.classList.add("one")
                    else if(getBaseLog(2, tile.innerText) == 2)
                    tile.classList.add("two")
                    else if(getBaseLog(2, tile.innerText) == 3)
                    tile.classList.add("three")
					else if(getBaseLog(2, tile.innerText) == 4)
                    tile.classList.add("four")
					else if(getBaseLog(2, tile.innerText) == 5)
                    tile.classList.add("five")
					else if(getBaseLog(2, tile.innerText) == 6)
                    tile.classList.add("six")
					else if(getBaseLog(2, tile.innerText) == 7)
                    tile.classList.add("seven")
					else if(getBaseLog(2, tile.innerText) == 8)
                    tile.classList.add("eight")
                    board.appendChild(tile)
                }
        }

    // Assign score to scoreBoard

    scoreBoard.innerText = score;
}

/**
 * Finds the exponent z given x and y.
 * Example:
 *  x <-- 2
 *  y <-- 8
 * 
 *  2^z = 8
 * 
 * This function is useful when scaling the tile
 *   colors based on the tile value.
 * 
 * @param {*} x 
 * @param {*} y 
 */
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

