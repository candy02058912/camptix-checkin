// Retrieve the "id" parameter from the URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// Fetch the data from the backend for this "id"
fetch(`/data?id=${id}`)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Display the information
      document.getElementById('info').innerText = `Information for ID ${id}: ${JSON.stringify(data.data)}`;
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
