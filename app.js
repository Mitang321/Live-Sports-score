document.addEventListener("DOMContentLoaded", () => {
  const gameForm = document.getElementById("game-form");
  const team1Input = document.getElementById("team1");
  const team2Input = document.getElementById("team2");
  const oversInput = document.getElementById("overs");
  const battingTeamSelect = document.getElementById("batting-team");
  const gameInfoElement = document.getElementById("game-info");
  const scoreElement = document.getElementById("score");
  const scoreUpdateSection = document.getElementById("score-update");

  let runs = 0;
  let wickets = 0;
  let battingTeam = "";

  function updateScore(runsScored, wicketsTaken) {
    runs += runsScored;
    wickets += wicketsTaken;
    scoreElement.textContent = `Score: ${runs}/${wickets}`;
  }

  function startGame(team1, team2, overs, battingTeam) {
    gameInfoElement.textContent = `Match between ${team1} and ${team2}. ${battingTeam} will bat first for ${overs} overs.`;
    scoreUpdateSection.style.display = "block";
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

  // Event listeners for score updates
  document
    .getElementById("run1")
    .addEventListener("click", () => updateScore(1, 0));
  document
    .getElementById("run2")
    .addEventListener("click", () => updateScore(2, 0));
  document
    .getElementById("run4")
    .addEventListener("click", () => updateScore(4, 0));
  document
    .getElementById("run6")
    .addEventListener("click", () => updateScore(6, 0));
  document
    .getElementById("wicket")
    .addEventListener("click", () => updateScore(0, 1));
});
