const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
];
async function getExercises(userID) {
  return await fetch(`/summary/exercises/${userID}/`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

async function getCardio(userID) {
  return await fetch(`/summary/cardio/${userID}/`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

makeChart(await getCardio(8));
makeTable(await getExercises(8));

function makeChart(data) {
  data = JSON.parse(data);
  new Chart(document.getElementById("summary"), {
    type: "line",
    data: {
      labels: data.map((row) => row.date),
      datasets: [
        {
          label: "Distance ran",
          data: data.map((row) => row.distance),
        },
      ],
    },
  });
}

function makeTable(data) {
  data = JSON.parse(data);
  let table = document.getElementById("summary-table");
  for (const line of data) {
    let row = table.insertRow();
    let i = 0;
    for (const key in line) {
      if (key != "id") {
        let cell = row.insertCell(i);
        cell.innerHTML = line[key];
        i++;
      }
    }
  }
}
