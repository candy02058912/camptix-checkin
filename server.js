require('dotenv').config();  // Load environment variables from .env file

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const Papa = require('papaparse');
const app = express();
const port = 5000;

// Read CSV file into memory
let csvData = {};
fs.readFile(process.env.CAMPTIX_EXPORT_CSV_PATH, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  Papa.parse(data, {
    header: false,
    complete: function (results) {
      // There might be duplicated headers in the CSV file, so we're handling it here.
      const originalHeaders = results.data[0];
      const newHeaders = [...originalHeaders];

      const headerCounts = {};

      originalHeaders.forEach((header, index) => {
        if (headerCounts[header] === undefined) {
          headerCounts[header] = 0;
        } else {
          headerCounts[header]++;
          newHeaders[index] = header + "_" + headerCounts[header];
        }
      });

      const rows = results.data.slice(1);

      rows.forEach((row, rowIndex) => {
        const rowData = {};

        row.forEach((cell, index) => {
          rowData[newHeaders[index]] = cell;
        });

        csvData[row[0]] = rowData;
      });

      console.log(csvData);
    }
  });
});



app.get('/checkin', async (req, res) => {
  const camptixId = req.query.id;

  try {
    const response = await axios.get(process.env.CAMPTIX_API, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      params: {
        'action': 'camptix-attendance',
        'camptix_secret': process.env.CAMPTIX_SECRET,
        'camptix_action': 'sync-model',
        'camptix_set_attendance': 'true',
        'camptix_id': camptixId
      }
    });

    res.json({ success: true, data: response.data });

  } catch (error) {
    res.json({ success: false, error: error.toString() });
  }
});

// Endpoint to get data by camptix_id
app.get('/data', (req, res) => {
  const id = req.query.id;
  console.log(csvData);
  if (csvData[id]) {
    res.json({ success: true, data: csvData[id] });
  } else {
    res.json({ success: false, message: 'ID not found' });
  }
});

// List all attendees.
app.get('/allData', (req, res) => {
  res.json({ success: true, data: Object.values(csvData) });
});

app.use(express.static('public')); // Serve your HTML, CSS, JS from a 'public' folder

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
