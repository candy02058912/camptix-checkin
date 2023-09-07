let allData = []; // This variable will store all the fetched data

document.addEventListener('DOMContentLoaded', (event) => {
  fetchData();
});

function fetchData() {
  fetch('/allData')
    .then(response => response.json())
    .then(data => {
      allData = data.data; // Store the fetched data in the allData variable
      populateTable(allData);
    });
}

function populateTable(data) {
  const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  data.forEach((row, index) => {
    const newRow = tableBody.insertRow();
    newRow.setAttribute('data-index', index); // setting index as data-attribute
    newRow.setAttribute('data-id', row['出席者 ID']); // assuming "出席者 ID" is the name of ID property in your data objects
    newRow.insertCell(0).innerText = row['出席者 ID'];
    newRow.insertCell(1).innerText = row.名字;
    newRow.insertCell(2).innerText = row.電子郵件地址;
  });
}
document.getElementById('dataTable').addEventListener('click', function(e) {
  if(e.target && e.target.nodeName == "TD") {
    const id = e.target.parentElement.getAttribute('data-id'); // Get the attendee ID from the data-id attribute
    const rowData = allData.find(row => row['出席者 ID'] === id); // Find the data object using the ID
    if (rowData) {
      populateModal(rowData);
      modal.style.display = "block";
    }
  }
});

function populateModal(data) {
  const modalHeader = document.querySelector('.modal-header h2');
  const modalBody = document.querySelector('.modal-body');
  modalHeader.innerText = data.名字; // Set the modal header to the attendee's name
  
  modalBody.innerHTML = ''; // Clear the previous modal content
  
  Object.entries(data).forEach(([key, value]) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = `${key}: ${value}`;
    modalBody.appendChild(paragraph);
  });
  
  // Create and add a Check-in button to the modal
  const checkinButton = document.createElement('button');
  checkinButton.classList.add('checkin-button');
  checkinButton.innerText = 'Check-in';
  checkinButton.addEventListener('click', () => {
    checkinAttendee(data['出席者 ID']);
  });
  modalBody.appendChild(checkinButton);
}

function checkinAttendee(id) {
  // Get the check-in button and update its text to "Checking in…"
  const checkinButton = document.querySelector('.checkin-button');
  checkinButton.textContent = 'Checking in…';
  checkinButton.disabled = true; // Disable the button to prevent multiple clicks

  fetch(`/checkin?id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update button text to "Check-in successful!"
        checkinButton.textContent = 'Check-in successful!';
      } else {
        // If there's an error, revert the button text to "Check-in" and enable it
        checkinButton.textContent = 'Check-in';
        checkinButton.disabled = false;
        alert('An error occurred during check-in: ' + data.error);
      }
    })
    .catch(error => {
      // If there's an error, revert the button text to "Check-in" and enable it
      checkinButton.textContent = 'Check-in';
      checkinButton.disabled = false;
      alert('An error occurred during check-in: ' + error);
    });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  const searchText = e.target.value.toLowerCase();

  const filteredData = allData.filter(row => {
    return row.名字.toLowerCase().includes(searchText) || row.電子郵件地址.toLowerCase().includes(searchText);
  });
  populateTable(filteredData);
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
