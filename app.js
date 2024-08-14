// Initial Setup
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let matchData = JSON.parse(localStorage.getItem("matchData")) || null;

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
    const team1Info = `${matchData.team1.name}: ${matchData.team1.score}/${matchData.team1.wickets}`;
    const team2Info = `${matchData.team2.name}: ${matchData.team2.score}/${matchData.team2.wickets}`;
    gameInfo.innerHTML = `
            <p><strong>Team 1:</strong> ${team1Info}</p>
            <p><strong>Team 2:</strong> ${team2Info}</p>
            <p><strong>Overs:</strong> ${matchData.currentOver}/${
      matchData.overs
    }</p>
            <p><strong>Batting:</strong> ${
              matchData.currentBatting === "team1"
                ? matchData.team1.name
                : matchData.team2.name
            }</p>
        `;
    ballInfo.innerHTML = `<p><strong>Ball:</strong> ${
      matchData.currentBall + 1
    }</p>`;
    overInfo.innerHTML = `<p><strong>Over:</strong> ${matchData.currentOver}</p>`;
  }
}

function setupScoreButtons() {
  const run1Btn = document.getElementById("run1");
  const run2Btn = document.getElementById("run2");
  const run4Btn = document.getElementById("run4");
  const run6Btn = document.getElementById("run6");
  const wicketBtn = document.getElementById("wicket");

  run1Btn.addEventListener("click", () => updateScore(1));
  run2Btn.addEventListener("click", () => updateScore(2));
  run4Btn.addEventListener("click", () => updateScore(4));
  run6Btn.addEventListener("click", () => updateScore(6));
  wicketBtn.addEventListener("click", () => updateScore(0, true));
}

function updateScore(runs, isWicket = false) {
  if (matchData) {
    const currentBattingTeam =
      matchData.currentBatting === "team1" ? matchData.team1 : matchData.team2;

    if (isWicket) {
      currentBattingTeam.wickets++;
      if (currentBattingTeam.wickets === 11) {
        alert("All wickets down! Next team to bat.");
        matchData.currentBatting =
          matchData.currentBatting === "team1" ? "team2" : "team1";
      }
    } else {
      currentBattingTeam.score += runs;
    }

    matchData.currentBall++;
    if (matchData.currentBall === 6) {
      matchData.currentBall = 0;
      matchData.currentOver++;
      if (matchData.currentOver === matchData.overs) {
        alert("Innings over!");
        matchData.currentBatting =
          matchData.currentBatting === "team1" ? "team2" : "team1";
        matchData.currentOver = 0;
        matchData.currentBall = 0;
      }
    }

    localStorage.setItem("matchData", JSON.stringify(matchData));
    displayMatchInfo();
  }
}

// Manually create an admin user
const users = JSON.parse(localStorage.getItem("users")) || [];
if (!users.some((user) => user.username === "admin")) {
  users.push({ username: "admin", password: "admin123", role: "admin" });
  localStorage.setItem("users", JSON.stringify(users));
}
