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

const data2 = await getExercises(1);
console.log(JSON.parse(data2));
const data3 = await getCardio(1);
console.log(JSON.parse(data3));

function makeChart(data) {
  data = JSON.parse(data);
  console.log(data);
  new Chart(document.getElementById("summary"), {
    type: "bar",
    data: {
      labels: data.map((row) => row.year),
      datasets: [
        {
          label: "Year",
          data: data.map((row) => row.count),
        },
      ],
    },
  });
}

function makeTable(data) {
  let table = document.getElementById("summary-table");
  for (const line of data) {
    let row = table.insertRow();
    let yearCell = row.insertCell(0);
    yearCell.innerHTML = line.year;
    let countCell = row.insertCell(1);
    countCell.innerHTML = line.count;
  }
}
