document.addEventListener("DOMContentLoaded", () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  let loggedInUser = null;
  let currentGame = null;

  // Manually add the admin user
  if (!users.find((user) => user.username === "admin")) {
    users.push({ username: "admin", password: "admin123", role: "admin" });
    localStorage.setItem("users", JSON.stringify(users));
  }

  const authForm = document.getElementById("auth-form");
  const formTitle = document.getElementById("form-title");
  const switchText = document.getElementById("switch-text");
  const switchBtn = document.getElementById("switch-btn");
  const gameCreationSection = document.getElementById("game-creation");
  const scoreUpdateSection = document.getElementById("score-update");
  const gameForm = document.getElementById("game-form");
  const scoreButtons = document.querySelectorAll("#score-update button");

  let isLoginMode = true;

  // Toggle between login and registration modes
  switchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    formTitle.textContent = isLoginMode ? "Login" : "Sign up";
    switchText.innerHTML = isLoginMode
      ? "Don't have an account? <a href='#' id='switch-btn'>Sign up</a>"
      : "Already have an account? <a href='#' id='switch-btn'>Login</a>";
    document.querySelector("button.btn").textContent = isLoginMode
      ? "Login"
      : "Sign up";
  });

  // Handle form submission
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("auth-username").value.trim();
    const password = document.getElementById("auth-password").value.trim();

    if (username === "" || password === "") {
      alert("Please enter both username and password.");
      return;
    }

    if (isLoginMode) {
      loginUser(username, password);
    } else {
      registerUser(username, password);
    }
  });

  function registerUser(username, password) {
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      alert("User already exists!");
      return;
    }

    users.push({ username, password, role: "user" }); // By default, users are registered as 'user'
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! You can now log in.");
    switchToLoginMode();
  }

  function loginUser(username, password) {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      loggedInUser = user;
      if (user.role === "admin") {
        gameCreationSection.style.display = "block";
        scoreUpdateSection.style.display = "block";
      } else {
        gameCreationSection.style.display = "none";
        scoreUpdateSection.style.display = "none";
      }
      document.getElementById("auth-section").style.display = "none";
      alert(`Welcome, ${username}!`);
    } else {
      alert("Invalid username or password!");
    }
  }

  function switchToLoginMode() {
    isLoginMode = true;
    formTitle.textContent = "Login";
    switchText.innerHTML =
      "Don't have an account? <a href='#' id='switch-btn'>Sign up</a>";
    document.querySelector("button.btn").textContent = "Login";
  }

  // Handle game creation
  gameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (loggedInUser && loggedInUser.role === "admin") {
      const team1 = document.getElementById("team1").value.trim();
      const team2 = document.getElementById("team2").value.trim();
      const overs = parseInt(document.getElementById("overs").value, 10);
      const battingTeam = document.getElementById("batting-team").value;

      if (!team1 || !team2 || isNaN(overs) || !battingTeam) {
        alert("Please fill out all fields correctly.");
        return;
      }

      currentGame = {
        team1,
        team2,
        overs,
        battingTeam,
        runs: { team1: 0, team2: 0 },
        wickets: { team1: 0, team2: 0 },
        balls: { team1: 0, team2: 0 },
        oversCount: { team1: 0, team2: 0 },
        target: null,
      };

      document.getElementById(
        "game-info"
      ).textContent = `Teams: ${team1} vs ${team2}`;
      document.getElementById(
        "score"
      ).textContent = `Score: ${currentGame.runs.team1}/0`;
      document.getElementById("ball-info").textContent = `Balls: 0 | Runs: 0`;
      document.getElementById("over-info").textContent = `Overs: 0.0`;

      alert("Game created successfully!");
    } else {
      alert("You must be logged in as an admin to create a game.");
    }
  });

  // Handle score updates
  scoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentGame && loggedInUser && loggedInUser.role === "admin") {
        const team = currentGame.battingTeam === "team1" ? "team1" : "team2";
        const buttonId = button.id;

        switch (buttonId) {
          case "run1":
            currentGame.runs[team] += 1;
            break;
          case "run2":
            currentGame.runs[team] += 2;
            break;
          case "run4":
            currentGame.runs[team] += 4;
            break;
          case "run6":
            currentGame.runs[team] += 6;
            break;
          case "wicket":
            currentGame.wickets[team] += 1;
            if (currentGame.wickets[team] >= 11) {
              alert("11 wickets have fallen. The next team will bat.");
              switchBattingTeam();
            }
            break;
          case "no-ball":
            // Handle no-ball
            break;
          case "wide":
            // Handle wide
            break;
          default:
            break;
        }

        updateScore();
      } else {
        alert("You must be logged in as an admin to update the score.");
      }
    });
  });

  function updateScore() {
    const team = currentGame.battingTeam === "team1" ? "team1" : "team2";
    document.getElementById(
      "score"
    ).textContent = `Score: ${currentGame.runs[team]}/${currentGame.wickets[team]}`;
    // Additional score update logic (balls, overs) would be added here
  }

  function switchBattingTeam() {
    currentGame.battingTeam =
      currentGame.battingTeam === "team1" ? "team2" : "team1";
    document.getElementById("score").textContent = `Score: ${
      currentGame.runs[currentGame.battingTeam]
    }/0`;
  }
});
