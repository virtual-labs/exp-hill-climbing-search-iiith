var oneshotAuto = true;
var refreshIntervalId = null;
var side = false;

const input = document.getElementById('autor');

function refresh() {

    if (document.getElementById('side').checked) {
        side = true;
    }
    else { 
        side = false;
    }

    if(isStuck) {
        document.getElementById('Min').style.display = "";
    }
    else {
        document.getElementById('Min').style.display = "none";
    }
	
    if (document.getElementById('auto').checked) {
        if (started) {
            document.getElementById('start').disabled = true;
            document.getElementById('side').disabled = true;
            document.getElementById('next').disabled = true;
            if (oneshotAuto) {
                oneshotAuto = false;
                refreshIntervalId = setInterval(() => {
                    if(!isQuestion){
                        if (next_count == 0) {
                            agent.nextMove(svgChessboard);
                            next_count = 1; 
                        } else {
                            agent.QueenMove(svgChessboard);
                            next_count = 0;
                        }}
                }, 1000*input.value)
            }
        } else {
            document.getElementById('next').disabled = false;
        }
    } else if (refreshIntervalId != null) {
        clearInterval(refreshIntervalId);
        document.getElementById('start').disabled = false;
        document.getElementById('next').disabled = false;
        document.getElementById('side').disabled = false;

        oneshotAuto = true;
    }

    if (started) {
        document.getElementById('start').disabled = true;
        document.getElementById('side').disabled = true;

    } else {
        document.getElementById('start').disabled = false;
        document.getElementById('side').disabled = false;


        clearInterval(refreshIntervalId);
        document.getElementById('start').disabled = false;
        document.getElementById('next').disabled = false;
        document.getElementById('side').disabled = false;

        oneshotAuto = true;
    }

    if (isQuestion || isObservation) {
		document.getElementById('QuestionBox').style.display = "";
        document.getElementById('next').disabled = true;
	} else {
		document.getElementById('QuestionBox').style.display = "none";
        document.getElementById('next').disabled = false;

	}

    if (ans_count == 0 && ans2_count == 0) {
        document.getElementById('Hint').innerHTML = "";
    }
	
	if (isObservation) {
		document.getElementById('qoro').innerHTML = "Observation";
		document.getElementById('submitform').style.display = "none";
	} else {
		document.getElementById('qoro').innerHTML = "Question";

        if (isQ1) {
		    document.getElementById('submitform').style.display = "";
        }
        else {
		    document.getElementById('submitform').style.display = "none";
        }
	}

    agent.speed = input.value;
}

setInterval(refresh, 30);
