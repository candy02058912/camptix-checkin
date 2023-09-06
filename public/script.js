// Retrieve the "id" parameter from the URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

function displayInfo(data) {
  const infoDiv = document.getElementById('info');

  const card = document.createElement('div');
  card.className = 'ticket-card';

  for (const [key, value] of Object.entries(data)) {
    const row = document.createElement('div');
    row.className = 'ticket-row';

    const label = document.createElement('div');
    label.className = 'ticket-label';
    label.textContent = key;

    const valueDiv = document.createElement('div');
    valueDiv.className = 'ticket-value';
    valueDiv.textContent = value;

    row.appendChild(label);
    row.appendChild(valueDiv);
    card.appendChild(row);
  }

  infoDiv.appendChild(card);


  const checkinButton = document.createElement('button');
  checkinButton.className = 'checkin-button';
  checkinButton.textContent = 'Check In';

}


// Fetch the data from the backend for this "id"
fetch(`/data?id=${id}`)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      displayInfo(data.data);
    } else {
      document.getElementById('info').innerText = 'ID not found';
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    document.getElementById('info').innerText = 'An error occurred';
  });

// Handle the Check-in button click
document.getElementById('checkinButton').addEventListener('click', () => {
  fetch(`/checkin?id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Checked-in successfully!');
      } else {
        alert('An error occurred during check-in: ' + data.error);
      }
    })
    .catch(error => {
      alert('An error occurred during check-in: ' + error);
    });
});
