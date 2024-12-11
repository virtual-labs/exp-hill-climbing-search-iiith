var correct_ans = 1;
var isQuestion = false;
var isObservation = false;
var isAnswer = true;
var isQ1 = false;
var isQ2 = false;

var ans_count = 0;
var ans2_count = 0;

var NoQuestion = true;

var chance = 0.5;

var selected;
var QnA = [
	['What is the heuristic value of the highlighted cell if the queen in that column is moved to that cell?', 'agent.heuristics'],
    ['Which position should the highlighted queen move to?', 'agent.moved']
]

function question() {
	// alert("Question!");
	var number = Math.floor(Math.random() * QnA.length)
	selected = QnA[number];
	console.log("sel", selected);
	document.getElementById('question').innerHTML = selected[0];
	return number;
}

function submit(a) {
	correct_ans = eval(selected[1]);

	var ans = correct_ans[qcol*size + qrow]

	console.log(ans)
	console.log(typeof (Number(a)), typeof (ans));
	console.log(Number(a), ans);

	console.log("my answer: ", Number(a));
	console.log("correct answer: ", ans);

	if (Number(a) == ans) {
		isQuestion = false;
		isAnswer = true;
		isQ1 = false;
		document.getElementById('ans').style.color = 'green';
		a = "";
		ans_count = 0;

	} else {
		document.getElementById('ans').style.color = 'red';

		ans_count += 1;

		if(ans_count == 3) {
			if(Number(a) < ans)
			{
				document.getElementById('Hint').innerHTML = "Hint: The correct answer is higher.";
				document.getElementById('Hint').style.color = 'red';
			}
			else 
			{
				document.getElementById('Hint').innerHTML = "Hint: The correct answer is lower.";
				document.getElementById('Hint').style.color = 'red';
			}
		}
	
		if (ans_count == 5) {

			document.getElementById('Hint').innerHTML = "The correct answer is " + ans;
			document.getElementById('Hint').style.color = 'green';
		}
		
		a = "";
	}

	
}

function ans2(col, row) {
	correct_ans = eval(selected[1]);
	var ans = correct_ans.row
	
	if(row == ans) {
		isQuestion = false;
		isAnswer = true;
		isQ2 = false;
		ans2_count = 0;
	}
	else {
		ans2_count += 1;

		document.getElementById('Hint').innerHTML = "Incorrect. Try again.";
		document.getElementById('Hint').style.color = 'red';

		if(ans2_count == 3) {
			document.getElementById('Hint').innerHTML = "Hint: The queen moves to the square with least value.";
			document.getElementById('Hint').style.color = 'red';
		}
	
		if (ans2_count == 5) {
			document.getElementById('Hint').innerHTML = "The queen moves to row  " + ans;
			document.getElementById('Hint').style.color = 'green';
		}
		
	}
}
