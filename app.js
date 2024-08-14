// Initial Setup
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let matchData = JSON.parse(localStorage.getItem("matchData")) || null;
let gamePaused = false;

document.addEventListener("DOMContentLoaded", () => {
  setupAuthForm();
  displayMatchInfo();
  updateUIBasedOnRole();
  setupScoreButtons();
});

function setupAuthForm() {
  const authForm = document.getElementById("auth-form");
  const switchBtn = document.getElementById("switch-btn");
  const formTitle = document.getElementById("form-title");

  let isLogin = true;

  switchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    formTitle.innerText = isLogin ? "Login" : "Sign Up";
    authForm.querySelector("button").innerText = isLogin ? "Login" : "Sign Up";
    switchBtn.innerHTML = isLogin
      ? "Don't have an account? <a href='#'>Sign up</a>"
      : "Already have an account? <a href='#'>Login</a>";
  });

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("auth-username").value;
    const password = document.getElementById("auth-password").value;

    if (isLogin) {
      login(username, password);
    } else {
      signUp(username, password);
    }
  });
}

function login(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    currentUser = user;
    updateUIBasedOnRole();
  } else {
    alert("Invalid username or password");
  }
}

function signUp(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userExists = users.some((user) => user.username === username);

  if (userExists) {
    alert("Username already exists");
  } else {
    const newUser = { username, password, role: "user" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("User registered successfully! Please log in.");
    document.getElementById("switch-btn").click();
  }
}

function updateUIBasedOnRole() {
  const gameCreationSection = document.getElementById("game-creation");
  const scoreUpdateSection = document.getElementById("score-update");
  const authSection = document.getElementById("auth-section");

  if (currentUser) {
    authSection.style.display = "none";
    if (currentUser.role === "admin") {
      gameCreationSection.style.display = "block";
      scoreUpdateSection.style.display = "block";
    } else {
      gameCreationSection.style.display = "none";
      scoreUpdateSection.style.display = "none";
      displayMatchInfo(); // Normal user can view score
    }
  } else {
    authSection.style.display = "block";
    gameCreationSection.style.display = "none";
    scoreUpdateSection.style.display = "none";
  }
}

document.getElementById("game-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const team1 = document.getElementById("team1").value;
  const team2 = document.getElementById("team2").value;
  const overs = document.getElementById("overs").value;
  const battingTeam = document.getElementById("batting-team").value;

  matchData = {
    team1: { name: team1, score: 0, wickets: 0 },
    team2: { name: team2, score: 0, wickets: 0 },
    overs: overs,
    currentBatting: battingTeam === "team1" ? "team1" : "team2",
    target: 0,
    currentOver: 0,
    currentBall: 0,
  };

  localStorage.setItem("matchData", JSON.stringify(matchData));
  displayMatchInfo();
});

function displayMatchInfo() {
  if (matchData) {
    const gameInfo = document.getElementById("game-info");
    const ballInfo = document.getElementById("ball-info");
    const overInfo = document.getElementById("over-info");
    const targetInfo = document.getElementById("target-info");
    const team1Info = `${matchData.team1.name} - ${matchData.team1.score}/${matchData.team1.wickets}`;
    const team2Info = `${matchData.team2.name} - ${matchData.team2.score}/${matchData.team2.wickets}`;

    gameInfo.innerHTML = `Team 1: ${team1Info} <br> Team 2: ${team2Info}`;
    ballInfo.innerHTML = `Current Over: ${matchData.currentOver}.${matchData.currentBall}`;
    overInfo.innerHTML = `Total Overs: ${matchData.overs}`;
    if (matchData.target > 0) {
      targetInfo.innerHTML = `Target: ${matchData.target}`;
    }
  }
}

function setupScoreButtons() {
  const run1 = document.getElementById("run1");
  const run2 = document.getElementById("run2");
  const run4 = document.getElementById("run4");
  const run6 = document.getElementById("run6");
  const wicket = document.getElementById("wicket");
  const noBall = document.getElementById("no-ball");
  const wide = document.getElementById("wide");
  const pauseGame = document.getElementById("pause-game");
  const resumeGame = document.getElementById("resume-game");
  const resetGame = document.getElementById("reset-game");

  run1.addEventListener("click", () => updateScore(1));
  run2.addEventListener("click", () => updateScore(2));
  run4.addEventListener("click", () => updateScore(4));
  run6.addEventListener("click", () => updateScore(6));
  wicket.addEventListener("click", () => updateWicket());
  noBall.addEventListener("click", () => updateScore(1)); // Treating no-ball as 1 run for simplicity
  wide.addEventListener("click", () => updateScore(1)); // Treating wide as 1 run for simplicity
  pauseGame.addEventListener("click", () => pauseGameFunction());
  resumeGame.addEventListener("click", () => resumeGameFunction());
  resetGame.addEventListener("click", () => resetGameFunction());
}

function updateScore(runs) {
  if (matchData && !gamePaused) {
    let currentBattingTeam = matchData[matchData.currentBatting];
    currentBattingTeam.score += runs;

    if (matchData.currentBall < 5) {
      matchData.currentBall++;
    } else {
      matchData.currentBall = 0;
      matchData.currentOver++;
    }

    if (
      matchData.currentOver === parseInt(matchData.overs) &&
      matchData.currentBall === 0
    ) {
      if (matchData.currentBatting === "team1") {
        matchData.target = currentBattingTeam.score + 1;
        matchData.currentBatting = "team2";
        matchData.currentOver = 0;
        matchData.currentBall = 0;
      } else {
        endMatch();
      }
    }

    localStorage.setItem("matchData", JSON.stringify(matchData));
    displayMatchInfo();
  }
}

function updateWicket() {
  if (matchData && !gamePaused) {
    let currentBattingTeam = matchData[matchData.currentBatting];
    currentBattingTeam.wickets++;

    if (
      currentBattingTeam.wickets === 11 ||
      (matchData.currentOver === parseInt(matchData.overs) &&
        matchData.currentBall === 0)
    ) {
      if (matchData.currentBatting === "team1") {
        matchData.target = currentBattingTeam.score + 1;
        matchData.currentBatting = "team2";
        matchData.currentOver = 0;
        matchData.currentBall = 0;
      } else {
        endMatch();
      }
    }

    localStorage.setItem("matchData", JSON.stringify(matchData));
    displayMatchInfo();
  }
}

function endMatch() {
  const team1Score = matchData.team1.score;
  const team2Score = matchData.team2.score;
  const winner =
    team2Score >= matchData.target
      ? matchData.team2.name
      : matchData.team1.name;
  alert(`${winner} wins the match!`);
  localStorage.removeItem("matchData");
  matchData = null;
  displayMatchInfo();
}

function pauseGameFunction() {
  gamePaused = true;
}

function resumeGameFunction() {
  gamePaused = false;
}

function resetGameFunction() {
  if (confirm("Are you sure you want to reset the game?")) {
    matchData = null;
    localStorage.removeItem("matchData");
    displayMatchInfo();
  }
}
