var started = false;
var next_count = 0;
var qrow;
var qcol;
var isPractice = false;
var isStuck = false;

var q2row;
var q2col;


var agent;
var svgChessboard;
var size;


function start() {
    started = true;
    agent.resume()
    updateValue(agent.iters, agent.curr.h, true);
    agent.hillClimbing(svgChessboard);
}


document.getElementById('reset').addEventListener('click', () => {
    agent.reset(svgChessboard);
});

document.getElementById('next').addEventListener('click', async () => {

    if (started) {
        if (next_count == 0) {
            agent.nextMove(svgChessboard);
            next_count = 1;
        }
        else {
            agent.QueenMove(svgChessboard);
            next_count = 0;
        }
    }

});

function updateValue(iteration, heuristic, init = false) {
    const history = document.getElementById('history');

    if (init) {
        history.innerHTML += `<hr style="border-style: solid; margin: 0px 0px" />`;

        history.innerHTML += `
            <div style="margin:5px 0px;">
                <p style="font-size:18px; color:red"><b> ${size} Queens Problem</b></p>
            </div>`;

        history.innerHTML += `<hr style="border-style: dotted; margin-top: 0px; margin-bottom:2px" />`;
    }

    history_new = `
        <div style="margin:5px 0px;">
            <p><b> Iteration:</b> ${iteration} &nbsp;<b>BHV:</b> ${heuristic}</p>
        </div>
    `;

    history.innerHTML += history_new;

}

// chessboard.addEventListener('click', function(event)  {
//     const container_size = chessboard.getBoundingClientRect().width;
// 	const squareSize = container_size / (size);

// 	const rect = chessboard.getBoundingClientRect();
//     console.log(event.clientX - rect.left)
//     console.log(event.clientY - rect.top)
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     console.log(squareSize)

//     // Calculate the row and column based on the clicked position
//     const col = Math.floor(x / squareSize);
//     const row = Math.floor(y / squareSize);

// 	console.log("clicked on", col, row)

//     if(isQ2) {
//         ans2(col, row)
//     }
// });

// 5 configurations for each grid size (hardcode these configurations) 
// 15 boards in total

// fix beam size as 2 for beam search in demo

// pretest 6 question and post test 6 questions (2 for each difficuly (easy, medium, hard))

// practice will different grid sizes and the grid configuration will be xompletely randomised
// beam search practice user can select 1, 2, 3 beam sizes