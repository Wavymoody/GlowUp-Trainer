const workouts = {
  fullBody: [
    "Squats 3x10",
    "Push-ups 3x10",
    "Glute Bridges 3x12",
    "Rows 3x10",
    "Plank 3x30s"
  ],
  upper: [
    "Incline Push-ups 3x12",
    "Dumbbell Rows 3x10",
    "Shoulder Taps 3x20",
    "Bicep Curls 3x12",
    "Tricep Dips 3x12"
  ],
  lower: [
    "Goblet Squats 3x10",
    "Deadlifts 3x10",
    "Lunges 3x10 each leg",
    "Calf Raises 3x15",
    "Side Plank 3x20s"
  ],
  conditioning: [
    "Jumping Jacks 30s",
    "High Knees 30s",
    "Mountain Climbers 20 reps",
    "Bodyweight Squats 20 reps",
    "Walk 15 mins"
  ]
};

function generatePlan(days) {
  const patterns = {
    3: ["Full Body", "Upper", "Lower"],
    4: ["Upper", "Lower", "Full Body", "Conditioning"],
    5: ["Upper", "Lower", "Upper", "Lower", "Conditioning"]
  };

  const schedule = [];
  const labels = ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"];

  for (let i = 0; i < 7; i++) {
    if (i < days) {
      const focus = patterns[days][i];
      schedule.push({
        label: labels[i],
        focus,
        exercises: workouts[focus.toLowerCase().replace(" ", "")]
      });
    } else {
      schedule.push({
        label: labels[i],
        focus: "Rest Day",
        exercises: ["Light walk 20–30 mins", "Stretch 5 mins"]
      });
    }
  }

  return schedule;
}

document.getElementById("generatePlanBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const currentWeight = document.getElementById("currentWeight").value;
  const goalWeight = document.getElementById("goalWeight").value;
  const days = Number(document.getElementById("daysPerWeek").value);

  const plan = generatePlan(days);
  const planContainer = document.getElementById("planContainer");
  const summary = document.getElementById("planSummary");

  summary.innerHTML = `
    Hey ${name || "there"}! You want to drop from ${currentWeight} → ${goalWeight}.  
    Here's your weekly plan:
  `;

  planContainer.innerHTML = "";
  plan.forEach((day) => {
    const card = document.createElement("div");
    card.className = "day-card";

    card.innerHTML = `
      <h3>${day.label}</h3>
      <p>${day.focus}</p>
    `;

    day.exercises.forEach(ex => {
      const exRow = document.createElement("div");
      exRow.className = "exercise";

      exRow.innerHTML = `
        <input type="checkbox" />
        <span>${ex}</span>
      `;

      card.appendChild(exRow);
    });

    planContainer.appendChild(card);
  });
});

// Progress tracker
const logs = [];

document.getElementById("addLogBtn").addEventListener("click", () => {
  const date = document.getElementById("logDate").value;
  const weight = Number(document.getElementById("logWeight").value);

  if (!date || !weight) return;

  logs.push({ date, weight });
  renderLogs();
  renderChart();
});

function renderLogs() {
  const list = document.getElementById("logList");
  list.innerHTML = "";
  logs.forEach(log => {
    const li = document.createElement("li");
    li.textContent = `${log.date}: ${log.weight} lbs`;
    list.appendChild(li);
  });
}

function renderChart() {
  const chart = document.getElementById("chart");
  chart.innerHTML = "";

  if (logs.length === 0) return;

  const weights = logs.map(l => l.weight);
  const max = Math.max(...weights);
  const min = Math.min(...weights);

  logs.forEach(log => {
    const bar = document.createElement("div");
    bar.className = "bar";

    const relative = (log.weight - min) / (max - min || 1);
    bar.style.height = `${20 + (1 - relative) * 80}%`;

    bar.innerHTML = `<span>${log.weight}</span>`;
    chart.appendChild(bar);
  });
}
