class NQueens {
    constructor(cols, seed = None, board = null) {
        this.seed = seed
        this.size = cols;
        this.board = board;

        if (this.board == null) {
            this.makeBoard();
        }
    }

    makeBoard() {
        Math.seedrandom(this.seed);
        this.board = new Array(this.size);
        for (let i = 0; i < this.size; i++) {
            this.board[i] = Math.floor(Math.random() * this.size);
        }
    }


    placeQueen(row, col) {
        this.board[col] = row;
    }

    drawBoard(svgElement, heuristics = null, moved = { row: -1, col: -1 }, question1 = false) {
        svgElement.innerHTML = "";

        const container_size = chessboard.getBoundingClientRect().width;
        const squareSize = container_size / (this.size);

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                square.setAttribute('x', x * squareSize);
                square.setAttribute('y', y * squareSize);
                square.setAttribute('width', squareSize);
                square.setAttribute('height', squareSize);
                square.setAttribute('fill', (x + y) % 2 === 0 ? '#eeeeee' : '#5b5b5b');

                svgElement.appendChild(square);
            }
        }
        // console.log(question)

        if (question1) {
            if (heuristics) {
                for (let i = 0; i < this.size; i++) {
                    for (let j = 0; j < this.size; j++) {

                        if (heuristics[i * this.size + j] != -1) {
                            if(i == moved.col && j == moved.row) {
                                continue;
                            }

                            else {
                                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                                text.setAttribute('x', i * squareSize + squareSize / 2);
                                text.setAttribute('y', j * squareSize + squareSize / 2);
                                text.setAttribute('text-anchor', 'middle');
                                text.setAttribute('dominant-baseline', 'central');
                                text.setAttribute('font-size', '28px');
                                text.textContent = heuristics[i * this.size + j];
                                svgElement.appendChild(text);
                            }
                        }
                    }
                }
            }

            if (moved.row !== -1 && moved.col !== -1) {
                const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                square.setAttribute('x', moved.col * squareSize);
                square.setAttribute('y', moved.row * squareSize);
                square.setAttribute('width', squareSize);
                square.setAttribute('height', squareSize);
                square.setAttribute('fill', 'red');
                square.setAttribute('opacity', '0.3');
                svgElement.appendChild(square);

            }

        }

        else {
            if (heuristics) {
                for (let i = 0; i < this.size; i++) {
                    for (let j = 0; j < this.size; j++) {
    
                        if (heuristics[i * this.size + j] != -1) {
                            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                            text.setAttribute('x', i * squareSize + squareSize / 2);
                            text.setAttribute('y', j * squareSize + squareSize / 2);
                            text.setAttribute('text-anchor', 'middle');
                            text.setAttribute('dominant-baseline', 'central');
                            text.setAttribute('font-size', '28px');
                            text.textContent = heuristics[i * this.size + j];
                            svgElement.appendChild(text);
                        }
                    }
                }
            }
    
            if (moved.row !== -1 && moved.col !== -1) {
                const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                square.setAttribute('x', moved.col * squareSize);
                square.setAttribute('y', moved.row * squareSize);
                square.setAttribute('width', squareSize);
                square.setAttribute('height', squareSize);
                square.setAttribute('fill', 'green');
                square.setAttribute('opacity', '0.3');
                svgElement.appendChild(square);
    
            }
    

        }
    
    }

    drawQueen(svgElement) {

        const container_size = chessboard.getBoundingClientRect().width;
        const squareSize = container_size / (this.size);

        fetch('images/queen.svg')
            .then(response => response.text())
            .then(svgData => {
                const parser = new DOMParser();
                const queenSvg = parser.parseFromString(svgData, 'image/svg+xml').querySelector('svg');
                queenSvg.setAttribute('width', squareSize); // Adjust queen size as needed
                queenSvg.setAttribute('height', squareSize);

                this.board.forEach((row, col) => {
                    // console.log(row, col)
                    const queenElement = queenSvg.cloneNode(true);
                    queenElement.setAttribute('x', col * squareSize);
                    queenElement.setAttribute('y', row * squareSize);
                    svgElement.appendChild(queenElement);
                });
            });
            
    }
}

class Node {
    constructor(state, heuristic) {
        this.state = state;
        this.h = heuristic;
    }
}

class Agent {
    constructor(init_state, seed = 42) {
        this.curr = new Node(init_state, this.h(init_state));
        // this.rand_obj = new Random(seed);
        this.speed = 1000;
        this.paused = true;
        this.initState = new Node(init_state, this.h(init_state));
        this.iters = 0;
        this.children = [];
        this.heuristics = [];
        this.curr_store = new Node(init_state, this.h(init_state));
        this.prev_store = new Node(init_state, this.h(init_state));
        this.moved = { row: -1, col: -1 };
    }

    h(state) {
        let total = 0;

        for (let col = 0; col < state.size; col++) {
            const row = state.board[col];
            for (let i = col + 1; i < state.size; i++) {
                if (state.board[i] === row) {
                    total += 1;
                }
                if (state.board[i] === row - (col - i)) {
                    total += 1;
                }
                if (state.board[i] === row + (col - i)) {
                    total += 1;
                }
            }
        }

        return total;
    }

    expandChild(state) {
        const children = [];
        const heuristics = [];
        const cols = state.size;
        let min_h = -1;

        const col_list = Array.from({ length: cols }, (_, i) => i);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < cols; j++) {

                if (state.board[i] != j) {
                    const temp = new NQueens(cols, state.seed, [...state.board],);
                    const old_qp = temp.board[i];
                    temp.placeQueen(j, i);
                    const temp_node = new Node(temp, this.h(temp));
                    heuristics.push(temp_node.h);
                }

                else {
                    heuristics.push(-1);
                }
            }
        }

        col_list.sort(() => Math.random() - 0.5);

        for (const i of col_list) {
            for (let j = 1; j < cols; j++) {
                const temp = new NQueens(cols, state.seed, [...state.board],);
                const old_qp = temp.board[i];
                temp.placeQueen((old_qp + j) % cols, i);
                const temp_node = new Node(temp, this.h(temp));

                if (min_h < 0 || temp_node.h < min_h) {
                    min_h = temp_node.h;
                    children.push(temp_node);
                }
            }
        }

        return { children, heuristics };
    }

    hillClimbing(svgElement) {
        console.log(isPractice)
        this.prev_store = this.curr;
        this.curr_store = this.curr;

        let { children, heuristics } = this.expandChild(this.curr.state);
        this.children = children;
        this.heuristics = heuristics;

    }

    async nextMove(svgElement) {
        if (this.paused) return;
        if (isQuestion) return;

        document.getElementById('next').disabled = true;

        // Update iteration number
        this.iters++;
        const iterationNumberElement = document.getElementById('iteration-number');
        iterationNumberElement.textContent = this.iters;

        if (this.curr_store.h === 0) {
            this.updateBoard(this.curr_store, svgElement);
            this.updateQueen(this.curr_store, svgElement);
            console.log("Problem Solved!");
            document.getElementById('next').disabled = false;
            started = false;
            return;
        }

        if (this.prev_store !== this.curr_store) {
            let { children, heuristics } = this.expandChild(this.curr_store.state);
            this.children = children;
            this.heuristics = heuristics;

        }

        const neighbour = this.children.reduce((minNode, node) => node.h < minNode.h ? node : minNode, this.children[0]);

        this.prev_store = this.curr_store;
        this.curr_store = neighbour;

        const moved = this.calculateMove(this.prev_store, this.curr_store);
        this.moved = moved;

        if (!NoQuestion && this.iters != 1) {
            await this.getQuestion(svgElement)
        }

        if (!isQuestion && isAnswer)
        {
            await this.updateGreen(svgElement);

            if(side == false)  {

                if(this.curr_store.h === this.prev_store.h)
                {
                    isStuck = true;
                    document.getElementById("Minima").innerHTML += "The algorithm is stuck in a local minima."
                    console.log("Stuck in local minima!");
                    document.getElementById('next').disabled = false;
                    started = false;
                    return;
                }
            }
        }

    }

    async getQuestion(svgElement) {

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(this.speed / 4);
        
        var rand = Math.random();
        var q;
        console.log(rand)

        if (rand < chance) {
            isQuestion = true;
            isAnswer = false;
            console.log("Question!");
            q = question();
            console.log("q", q)

            if (q == 0)
            {
                isQ1 = true;
                await this.type1(svgElement);

            }
            else 
            {
                isQ2 = true;
                await this.type2(svgElement)

            }
        }
    }

    async type1(svgElement) {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        qrow = Math.floor(Math.random() * this.curr.state.size);
        qcol = Math.floor(Math.random() * this.curr.state.size);

        console.log(qrow, qcol)

        if(this.prev_store.state.board[qcol] == qrow) {
            qrow = (qrow + 1) % this.curr.state.size;
        }

        var moved = {row: qrow, col: qcol}

        console.log("moved", moved)

        await delay(this.speed / 4);
        this.curr_store.state.drawBoard(svgElement, this.heuristics, moved, true);
        this.prev_store.state.drawQueen(svgElement)
        // this.updateQueen(this.curr_store, svgElement);

    }

    async type2(svgElement) {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        q2col = this.moved.col

        console.log("moving queen", this.moved)
        q2row = this.prev_store.state.board[q2col]
        var moved = {row: q2row, col: q2col}

        console.log(moved)

        await delay(this.speed / 4);
        this.curr_store.state.drawBoard(svgElement, this.heuristics, moved, true);
        this.prev_store.state.drawQueen(svgElement)
        
    }

    async updateGreen(svgElement) {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await delay(this.speed / 4);
        this.updateBoard(this.curr_store, svgElement, this.heuristics, this.moved);
        this.updateQueen(this.prev_store, svgElement);

        document.getElementById('next').disabled = false;

    }

    async QueenMove(svgElement) {
        document.getElementById('next').disabled = true;
        await this.update(svgElement);
        document.getElementById('next').disabled = false;
    }

    async update(svgElement) {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await delay(this.speed / 4);
        this.updateBoard(this.curr_store, svgElement, this.heuristics, this.moved);
        this.updateQueen(this.curr_store, svgElement);

        await delay(this.speed / 4);
        this.updateHeuristicValue(this.curr_store);

        await delay(this.speed / 4);
        updateValue(this.iters, this.curr_store.h);
    }

    updateHeuristicValue(curr) {
        const heuristicValueElement = document.getElementById('heuristic-number');
        heuristicValueElement.textContent = curr.h;
    }

    updateBoard(curr, svgElement, heuristics, moved = { row: -1, col: -1 }) {
        curr.state.drawBoard(svgElement, heuristics, moved);
    }

    updateQueen(curr, svgElement) {
        curr.state.drawQueen(svgElement);

    }

    calculateMove(prevState, currState) {

        const prevBoard = prevState.state.board;
        const currBoard = currState.state.board;

        for (let i = 0; i < prevState.state.size; i++) {
            if (prevBoard[i] !== currBoard[i]) {
                return { row: currBoard[i], col: i };
            }
        }

        return { row: -1, col: -1 };
    }


    reset(svgElement) {
        clearInterval(this.interval);
        started = false;

        this.paused = true;
        this.speed = 1000;
        this.iters = 0;

        const iterationNumberElement = document.getElementById('iteration-number');
        iterationNumberElement.textContent = '0';

        const heuristicValueElement = document.getElementById('heuristic-number');
        heuristicValueElement.textContent = this.curr.h;

        const history = document.getElementById('history');
        history.innerHTML = "";

        this.curr.state.drawBoard(svgElement);
        this.curr.state.drawQueen(svgElement);

        isQ1 = false;
        isQ2 = false;
        isQuestion = false;
        isStuck = false;

        next_count = 0;
        this.moved = { row: -1, col: -1 };
        this.children = []
        this.heuristics = []

    }

    resume() {
        this.paused = false;
    }

}

const chessboard = document.querySelector('.chessboard');

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid-sizes');

    grid.addEventListener('change', (event) => {
        event.preventDefault();
        started = false;

        size = parseInt(event.target.value);
        var op = size % 10;
        size = Math.floor(size / 10);
        console.log(size)

        chessboard.innerHTML = "";
        svgChessboard = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        const container_size = chessboard.getBoundingClientRect().width;
        chessboard.setAttribute('height', container_size);

        svgChessboard.setAttribute('width', container_size);
        svgChessboard.setAttribute('height', container_size);
        chessboard.appendChild(svgChessboard);

        if(isPractice) {
            const nQueens = new NQueens(size, null);
            nQueens.drawBoard(svgChessboard);
            nQueens.drawQueen(svgChessboard);
            agent = new Agent(nQueens);            
        }
        else {
            const nQueens = new NQueens(size, 20 + op);
            nQueens.drawBoard(svgChessboard);
            nQueens.drawQueen(svgChessboard);
            agent = new Agent(nQueens);
        }

        const heuristicValueElement = document.getElementById('heuristic-number');
        heuristicValueElement.textContent = agent.curr.h;

    });

    grid.dispatchEvent(new Event('change'));

});

chessboard.addEventListener('click', function(event)  {
    const container_size = chessboard.getBoundingClientRect().width;
	const squareSize = container_size / (size);

	const rect = chessboard.getBoundingClientRect();
    console.log(event.clientX - rect.left)
    console.log(event.clientY - rect.top)
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log(squareSize)

    // Calculate the row and column based on the clicked position
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);

	console.log("clicked on", col, row)

    if(isQ2) {
        ans2(col, row)
    }
});