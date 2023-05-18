async function getExercises() {
    return fetch("/exercises").then(
        response => response.json()
    )
}


function searchExerciseNames() {
    // Start typing into input box, suggestions pop up to select from
    const input = document.getElementById("add_exercise_name").value;

    let add_exercise_metrics = document.getElementById("add_exercise_metrics");
    add_exercise_metrics.innerHTML = ''

    //TODO: Send input to exercise api, setup list of matches as links.
    fetch(
        " https://api.api-ninjas.com/v1/exercises?name=" + input,
        {headers:{
            "X-Api-Key" : "DT9iBh6Bc5L2TSHIqAGffg==IlyEVIuByrruyhnn"
        }}
    ).then(
        response => response.json()
    ).then(
        response => {
            console.log(response)
            let results = []
            for (let result of response) {
                results.push({name: result.name, type: result.type})
            }
            return results  
        }
    ).then(results => {
        let add_exercise_name_dropdown = document.getElementById("add_exercise_name_dropdown");

        add_exercise_name_dropdown.innerHTML = ''

        for (let exercise of results) {
            let div = document.createElement("div")
            let suggestion = document.createElement("button")

            suggestion.onclick = e => selectExerciseName(e.target.textContent, e.target.value)

            suggestion.textContent = exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1).toLowerCase()
            suggestion.value = exercise.type
            suggestion.type = "text/css"
            div.appendChild(suggestion)
            add_exercise_name_dropdown.appendChild(div)
        }
    });
}


function selectExerciseName(name, type) {
    // Picked an exercise name, 
    // expands add to have all the required metric fields
    // search bar has that exercise name filled into it.
    fetch(
        "/exercise/metrics/" + type
    ).then(
        response => response.json()
    ).then(
        metrics => {
            let add_exercise_metrics = document.getElementById("add_exercise_metrics");

            add_exercise_metrics.innerHTML = ''

            for (const metric of metrics) {
                let div = document.createElement("div")
                let metric_label = document.createElement("label")
                metric_label.innerHTML = metric

                div.appendChild(metric_label)

                let metric_input = document.createElement("input")
                metric_input.required = true
                metric_input.type = "number"
                metric_input.name = metric
                metric_input.classList.add("metric_input")

                div.appendChild(metric_input)
                add_exercise_metrics.appendChild(div)
            }

            let div = document.createElement("div")
            let add_exercise_button = document.createElement("input")
            add_exercise_button.required = true
            add_exercise_button.type = "button"
            add_exercise_button.name = "add_exercise"
            add_exercise_button.value = "Add"

            add_exercise_button.addEventListener('click', addExercise);

            div.appendChild(add_exercise_button)

            add_exercise_metrics.appendChild(div)
        }
    );

    const exercise_name_field = document.getElementById("add_exercise_name")
    exercise_name_field.value = name

    add_exercise_name_dropdown.innerHTML = ''

   
}

function addExercise() {
    const exercise_name = document.getElementById("add_exercise_name").value
    let metrics = document.getElementsByClassName("metric_input")
    let values = []
    for (let metric of metrics) {
        values.push({
            unit: metric.name,
            value: metric.value
        })
    }

    // Filled in all metrics 
    console.log({ exercise_name: exercise_name });
    console.log(values);

    fetch("/add_exercise",
        {
            method: "POST",
            body: {
                exercise_name: exercise_name,
                metrics: metrics
            },
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
    )
        // .then((response) => response.json())
        .then((json) => console.log(json));

    // Reloads with hopefully that exercise added.
    window.location.href = '/workout'
}

async function fillExercises() {
    getExercises().then(
        exercises => {
            const exercises_view = document.getElementById("exercises")
            for (let exercise of Object.keys(exercises)) {
                let e_li = document.createElement("li")
                let ol = document.createElement("ul")
                ol.textContent = exercise

                for (let set of exercises[exercise].reverse()) {
                    let s_li = document.createElement("li")
                    s_li.textContent = "SET " + String(set.number) + ":"

                    for (let metric of set.metrics) {
                        let p = document.createElement("p")
                        p.textContent = String(metric.value) + " " + String(metric.unit)
                        s_li.appendChild(p)
                    }

                    ol.appendChild(s_li)
                }

                e_li.appendChild(ol)
                exercises_view.appendChild(e_li)
            }
        }
    )
}

fillExercises()
