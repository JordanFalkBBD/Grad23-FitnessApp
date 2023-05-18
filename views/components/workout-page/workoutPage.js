// TODO: extract to env or config
const NINJA_API_KEY = "ggutd45z+JF1zHIFemjfpQ==S5eWla6TxzazEdqO";

async function getExercises() {
  return fetch("/exercises").then((response) => response.json());
}

async function getWorkout() {
  return fetch("/workout/info").then((response) => response.json());
}

function updateWorkoutName() {
  const name = document.getElementById("workout_name")
  fetch("/workout/update/name/" + name)
}

function searchExerciseNames() {
  // Start typing into input box, suggestions pop up to select from
  const input = document.getElementById("add_exercise_name").value;

  let add_exercise_metrics = document.getElementById("add_exercise_metrics");
  add_exercise_metrics.innerHTML = "";

  fetch("/ninja/" + input)
    .then((response) => response.json())
    .then((response) => {
      let results = [];
      for (let result of response) {
        results.push({ name: result.name, type: result.type });
      }
      return results;
    })
    .then((results) => {
      let add_exercise_name_dropdown = document.getElementById(
        "add_exercise_name_dropdown"
      );

      add_exercise_name_dropdown.innerHTML = "";

      for (let exercise of results) {
        let div = document.createElement("div");
        let suggestion = document.createElement("button");

        suggestion.onclick = (e) =>
          selectExerciseName(e.target.textContent, e.target.value);

        suggestion.textContent =
          exercise.name.charAt(0).toUpperCase() +
          exercise.name.slice(1).toLowerCase();
        suggestion.value = exercise.type;
        suggestion.type = "text/css";
        div.appendChild(suggestion);
        add_exercise_name_dropdown.appendChild(div);
      }
    });
}

function selectExerciseName(name, type) {
  // Picked an exercise name,
  // expands add to have all the required metric fields
  // search bar has that exercise name filled into it.
  fetch("/exercises/metrics/" + type)
    .then((response) => response.json())
    .then((metrics) => {
      let add_exercise_metrics = document.getElementById(
        "add_exercise_metrics"
      );

      add_exercise_metrics.innerHTML = "";

      for (const metric of metrics) {
        let div = document.createElement("div");
        let metric_label = document.createElement("label");
        metric_label.innerHTML = metric;

        div.appendChild(metric_label);

        let metric_input = document.createElement("input");
        metric_input.required = true;
        metric_input.type = "number";
        metric_input.name = metric;
        metric_input.classList.add("metric_input");


        div.appendChild(metric_input);
        add_exercise_metrics.appendChild(div);
      }

      let div = document.createElement("div");
      let submit_button = document.createElement("input");
      submit_button.required = true;
      submit_button.type = "submit";
      submit_button.name = "submit";
      submit_button.value = "+";

      div.appendChild(submit_button);

      add_exercise_metrics.appendChild(div);
    });

  const exercise_name_field = document.getElementById("add_exercise_name");
  exercise_name_field.value = name;

  add_exercise_name_dropdown.innerHTML = "";
}

function addExercise() {
  const exercise_name_input = document.getElementById("add_exercise_name");
  const exercise_name = exercise_name_input.value
  exercise_name_input.value = ""
  
  let metrics = document.getElementsByClassName("metric_input");
  let values = [];
  for (let metric of metrics) {
    values.push({
      unit: metric.name,
      value: metric.value,
    });
  }

  let add_exercise_metrics = document.getElementById(
    "add_exercise_metrics"
  );

  add_exercise_metrics.innerHTML = ""

  fetch("/exercises/add", {
    method: "POST",
    body: {
      exercise_name: exercise_name,
      metrics: metrics,
    },
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((json) => console.log(json));

  // Reloads with hopefully that exercise added.
  fillExercises()
}


async function insertMetrics(parent, metrics) {
  for (let metric of metrics) {
    let metric_info = document.createElement("p");
    metric_info.textContent = String(metric.value) + " " + String(metric.unit);
    parent.appendChild(metric_info);
  }
}

async function insertSetOfExercises(parent, exercise) {
  for (let set of exercise) {
    let exercise_info = document.createElement("li");
    exercise_info.textContent = "SET " + String(set.number) + ":";
    insertMetrics(exercise_info, set.metrics)
    parent.appendChild(exercise_info);
  }
}

async function fillExercises() {
  const exercises_view = document.getElementById("exercises");

  exercises_view.innerHTML = "";

  getExercises().then((exercises) => {
    for (let exercise of Object.keys(exercises)) {
      let e_li = document.createElement("li");
      let set_of_exercises = document.createElement("ul");
      set_of_exercises.textContent = exercise;
      insertSetOfExercises(set_of_exercises, exercises[exercise].reverse())
      e_li.appendChild(set_of_exercises);
      exercises_view.appendChild(e_li);
    }
  });
}


async function fillWorkout() {
  getWorkout().then(workout => {
    workout_date = document.getElementById("workout_date")
    workout_date.innerHTML = String(workout.date) + " : "
    workout_name = document.getElementById("workout_name")
    workout_name.value = workout.name
  }
  )
}

fillWorkout();
fillExercises();

