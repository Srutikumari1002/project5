let hintCount = 3;
let hintIndex = 0;


let secretNumber = "";
let digits = 0;

let allowRepeat = false;

// TIMER VARIABLES
let timeLeft = 300; // 5 minutes
let timerInterval = null;

function startGame() {
  const name = document.getElementById("playerName").value.trim();
  digits = parseInt(document.getElementById("digitCount").value);

  if (name === "" || digits < 3 || digits > 6) {
    alert("Enter valid name and digits (3–6)");
    return;
  }

  // Difficulty rule
  allowRepeat = digits >= 6;
  secretNumber = generateNumber(digits, allowRepeat);

  // UI updates
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("welcome").innerText =
    `Welcome ${name}! Guess the ${digits}-digit number`;

  // Reset hints
  hintCount = 3;
  document.getElementById("hintBtn").innerText = "Show Hints (3 left)";
  document.getElementById("hintBtn").disabled = false;

  // Start timer
  startTimer();

  console.log(secretNumber); // for testing
}

function generateNumber(length, repeatAllowed) {
  let result = "";

  while (result.length < length) {
    let digit = Math.floor(Math.random() * 10);
    if (repeatAllowed || !result.includes(digit)) {
      result += digit;
    }
  }
  return result;
}

function checkGuess() {
  const guess = document.getElementById("guessInput").value;

  if (guess.length !== digits || isNaN(guess)) {
    alert(`Enter exactly ${digits} digits`);
    return;
  }

  let correctDigits = 0;
  let rightPlace = 0;

  for (let i = 0; i < digits; i++) {
    if (secretNumber.includes(guess[i])) correctDigits++;
    if (secretNumber[i] === guess[i]) rightPlace++;
  }

  addToHistory(guess, correctDigits, rightPlace);

  // 🎉 WIN CONDITION
  if (rightPlace === digits) {
    document.getElementById("resultMessage").innerText =
      `🎉 Congratulations! You guessed the number ${secretNumber} correctly!`;

    endGame();
  }

  document.getElementById("guessInput").value = "";
}

function addToHistory(guess, correct, place) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${guess}</td>
    <td>${correct}</td>
    <td>${place}</td>
  `;
  document.getElementById("historyBody").appendChild(row);
}

function showHints() {
  if (hintCount === 0) return;

  const num = Number(secretNumber);
  let message = "";

  if (hintIndex === 0) {
    // HINT 1: Sum of digits
    let sum = secretNumber
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);

    message = `➕ Sum of digits is ${sum}`;
  }

  else if (hintIndex === 1) {
    // HINT 2: Range hint
    let lower = Math.floor(num / 100) * 100;
    let upper = lower + 300;

    message = `📏 Number lies between ${lower} and ${upper}`;
  }

  else if (hintIndex === 2) {
    // HINT 3: Odd or Even
    message = num % 2 === 0
      ? `🔢 The number is EVEN`
      : `🔢 The number is ODD`;
  }

  document.getElementById("evenHint").innerText = message;

  hintCount--;
  hintIndex++;

  document.getElementById("hintBtn").innerText =
    `Show Hint (${hintCount} left)`;

  if (hintCount === 0) {
    document.getElementById("hintBtn").disabled = true;
  }
}

 
/* ================= TIMER ================= */

function startTimer() {
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      document.getElementById("resultMessage").innerText =
        `⏱️ Time's up! The correct number was ${secretNumber}`;
      endGame();
    }
  }, 1000);
}

function updateTimerDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  document.getElementById("timer").innerText =
    `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("guessInput").disabled = true;
  document.getElementById("restartBtn").classList.remove("hidden");
}

/* ================= RESTART ================= */

function restartGame() {
  location.reload();
}
