let questions = [];
let currentQ = 0;
let userAnswers = [];
let markedForReview = [];

function loadTest() {
  const urlParams = new URLSearchParams(window.location.search);
  const testName = urlParams.get('test');
  fetch(`tests/${testName}.json`)
    .then(res => res.json())
    .then(data => {
      questions = data;
      userAnswers = new Array(questions.length).fill("");
      markedForReview = new Array(questions.length).fill(false);
      renderQuestion();
      renderPalette();
    });
}

function renderQuestion() {
  const q = questions[currentQ];
  document.getElementById("qText").innerText = "Q" + (currentQ + 1) + ". " + q.question;
  const options = q.options;
  let html = "";
  for (let key in options) {
    html += \`<div><label><input type="radio" name="opt" value="\${key}" \${userAnswers[currentQ] === key ? "checked" : ""}> \${key}. \${options[key]}</label></div>\`;
  }
  document.getElementById("options").innerHTML = html;
  renderPalette();
}

function getSelectedOption() {
  const opts = document.getElementsByName("opt");
  for (let i = 0; i < opts.length; i++) {
    if (opts[i].checked) return opts[i].value;
  }
  return "";
}

function saveAnswer() {
  userAnswers[currentQ] = getSelectedOption();
}

function nextQuestion() {
  saveAnswer();
  if (currentQ < questions.length - 1) {
    currentQ++;
    renderQuestion();
  }
}

function prevQuestion() {
  saveAnswer();
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
}

function markReview() {
  saveAnswer();
  markedForReview[currentQ] = true;
  nextQuestion();
}

function renderPalette() {
  const container = document.getElementById("palette");
  container.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    const btn = document.createElement("button");
    btn.innerText = i + 1;
    if (i === currentQ) btn.style.border = "2px solid black";
    if (markedForReview[i]) {
      btn.style.backgroundColor = "orange";
    } else if (userAnswers[i]) {
      btn.style.backgroundColor = "green";
    } else {
      btn.style.backgroundColor = "red";
    }
    btn.onclick = () => {
      saveAnswer();
      currentQ = i;
      renderQuestion();
    };
    container.appendChild(btn);
  }
}

function submitTest() {
  saveAnswer();
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) {
      score++;
    }
  }
  document.getElementById("resultBox").style.display = "block";
  document.getElementById("resultBox").innerHTML = \`<h3>Your Score: \${score} / \${questions.length}</h3>\`;
  document.getElementById("questionBox").style.display = "none";
  document.querySelector(".controls").style.display = "none";
}