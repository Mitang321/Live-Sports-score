document.addEventListener("DOMContentLoaded", () => {
  const gameForm = document.getElementById("game-form");
  const team1Input = document.getElementById("team1");
  const team2Input = document.getElementById("team2");
  const oversInput = document.getElementById("overs");
  const battingTeamSelect = document.getElementById("batting-team");
  const gameInfoElement = document.getElementById("game-info");
  const scoreElement = document.getElementById("score");
  const ballInfoElement = document.getElementById("ball-info");
  const overInfoElement = document.getElementById("over-info");
  const scoreUpdateSection = document.getElementById("score-update");

  let runs = 0;
  let wickets = 0;
  let balls = 0;
  let totalRuns = 0;
  let oversCompleted = 0;
  let battingTeam = "";
  let isGamePaused = false;

  function updateScore(runsScored, wicketsTaken, ballsFaced) {
    if (isGamePaused) return;

    runs += runsScored;
    totalRuns += runsScored;
    wickets += wicketsTaken;
    balls += ballsFaced;

    if (balls % 6 === 0 && balls > 0) {
      oversCompleted += 1;
      balls = 0;
    }

    scoreElement.textContent = `Score: ${runs}/${wickets}`;
    ballInfoElement.textContent = `Balls: ${
      balls + oversCompleted * 6
    } | Runs: ${totalRuns}`;
    overInfoElement.textContent = `Overs: ${oversCompleted}.${balls}`;
  }

  function startGame(team1, team2, overs, battingTeam) {
    gameInfoElement.textContent = `Match between ${team1} and ${team2}. ${battingTeam} will bat first for ${overs} overs.`;
    scoreUpdateSection.style.display = "block";
  }

  function pauseGame() {
    isGamePaused = true;
  }

  function resumeGame() {
    isGamePaused = false;
  }

  function resetGame() {
    runs = 0;
    wickets = 0;
    balls = 0;
    totalRuns = 0;
    oversCompleted = 0;
    isGamePaused = false;

    scoreElement.textContent = "Score: 0/0";
    ballInfoElement.textContent = "Balls: 0 | Runs: 0";
    overInfoElement.textContent = "Overs: 0.0";
  }

  gameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const team1 = team1Input.value.trim();
    const team2 = team2Input.value.trim();
    const overs = parseInt(oversInput.value, 10);
    battingTeam = battingTeamSelect.value === "team1" ? team1 : team2;

    if (team1 && team2 && overs > 0) {
      startGame(team1, team2, overs, battingTeam);
    }
  });

  document
    .getElementById("run1")
    .addEventListener("click", () => updateScore(1, 0, 1));
  document
    .getElementById("run2")
    .addEventListener("click", () => updateScore(2, 0, 1));
  document
    .getElementById("run4")
    .addEventListener("click", () => updateScore(4, 0, 1));
  document
    .getElementById("run6")
    .addEventListener("click", () => updateScore(6, 0, 1));
  document
    .getElementById("wicket")
    .addEventListener("click", () => updateScore(0, 1, 1));
  document
    .getElementById("no-ball")
    .addEventListener("click", () => updateScore(1, 0, 0));
  document
    .getElementById("wide")
    .addEventListener("click", () => updateScore(1, 0, 0));

  document.getElementById("pause-game").addEventListener("click", pauseGame);
  document.getElementById("resume-game").addEventListener("click", resumeGame);
  document.getElementById("reset-game").addEventListener("click", resetGame);
});
