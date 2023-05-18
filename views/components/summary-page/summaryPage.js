const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
];
async function getData() {
  const response = await fetch();
  return response.json();
}

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
let table = document.getElementById("summary-table");
for (const line of data) {
  let row = table.insertRow();
  let yearCell = row.insertCell(0);
  yearCell.innerHTML = line.year;
  let countCell = row.insertCell(1);
  countCell.innerHTML = line.count;
}
