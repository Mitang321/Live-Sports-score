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
function login(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (username === "admin" && password === "admin123") {
    const adminUser = { username, password, role: "admin" };
    localStorage.setItem("currentUser", JSON.stringify(adminUser));
    currentUser = adminUser;
    updateUIBasedOnRole();
    return;
  }

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
      displayMatchInfo();
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
    ballInfo.innerHTML = `Balls: ${matchData.currentBall} | Runs: ${matchData.currentBall}`;
    overInfo.innerHTML = `Overs: ${matchData.currentOver}`;
    targetInfo.innerHTML =
      matchData.currentBatting === "team2" ? `Target: ${matchData.target}` : "";
  }
}

function setupScoreButtons() {
  document
    .getElementById("run1")
    .addEventListener("click", () => updateScore(1));
  document
    .getElementById("run2")
    .addEventListener("click", () => updateScore(2));
  document
    .getElementById("run4")
    .addEventListener("click", () => updateScore(4));
  document
    .getElementById("run6")
    .addEventListener("click", () => updateScore(6));
  document
    .getElementById("wicket")
    .addEventListener("click", () => updateWicket());
  document
    .getElementById("no-ball")
    .addEventListener("click", () => updateNoBall());
  document.getElementById("wide").addEventListener("click", () => updateWide());
  document
    .getElementById("pause-game")
    .addEventListener("click", () => pauseGame());
  document
    .getElementById("resume-game")
    .addEventListener("click", () => resumeGame());
  document
    .getElementById("reset-game")
    .addEventListener("click", () => resetGame());
}

function updateScore(runs) {
  if (gamePaused) return;

  if (matchData) {
    const battingTeam =
      matchData.currentBatting === "team1" ? "team1" : "team2";
    matchData[battingTeam].score += runs;
    matchData.currentBall += 1;
    if (matchData.currentBall % 6 === 0) {
      matchData.currentOver += 1;
      matchData.currentBall = 0;
    }
    if (matchData[battingTeam].wickets >= 11) {
      alert(
        `${matchData[battingTeam === "team1" ? "team1" : "team2"].name} All Out`
      );
      switchBatting();
    }
    localStorage.setItem("matchData", JSON.stringify(matchData));
    displayMatchInfo();
  }
}

function updateWicket() {
  if (gamePaused) return;

  if (matchData) {
    const battingTeam =
      matchData.currentBatting === "team1" ? "team1" : "team2";
    matchData[battingTeam].wickets += 1;
    matchData.currentBall += 1;
    if (matchData.currentBall % 6 === 0) {
      matchData.currentOver += 1;
      matchData.currentBall = 0;
    }
    if (matchData[battingTeam].wickets >= 11) {
      alert(`${matchData[battingTeam].name} All Out`);
      switchBatting();
    }
    localStorage.setItem("matchData", JSON.stringify(matchData));
    displayMatchInfo();
  }
}

function switchBatting() {
  if (matchData) {
    if (matchData.currentBatting === "team1") {
      matchData.currentBatting = "team2";
      matchData.target = matchData.team1.score + 1;
    } else {
      alert("Game Over");
      resetGame();
    }
    matchData.currentBall = 0;
    matchData.currentOver = 0;
    localStorage.setItem("matchData", JSON.stringify(matchData));
    displayMatchInfo();
  }
}

function updateNoBall() {
  if (gamePaused) return;

  updateScore(1);
}

function updateWide() {
  if (gamePaused) return;

  updateScore(1);
}

function pauseGame() {
  gamePaused = true;
}

function resumeGame() {
  gamePaused = false;
}

function resetGame() {
  matchData = null;
  localStorage.removeItem("matchData");
  localStorage.removeItem("currentUser");
  location.reload();
}
