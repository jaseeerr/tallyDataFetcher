const axios = require('axios');
const xml2js = require('xml2js');

// URL for TallyPrime's API (default port is 9000)
const tallyAPIURL = 'http://localhost:9000';  // Replace with your Tally server URL and port

// Simple XML request to fetch the company list
const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
  <ENVELOPE>
    <HEADER>
      <TALLYREQUEST>List Companies</TALLYREQUEST>
    </HEADER>
    <BODY>
      <REQUESTDATA>
        <TALLYMESSAGE>
          <LISTCOMPANIES>
            <COMPANY></COMPANY>  <!-- Empty to list all companies -->
          </LISTCOMPANIES>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </BODY>
  </ENVELOPE>`;

// Send POST request to fetch the company list
axios.post(tallyAPIURL, xmlRequest, {
  headers: { 'Content-Type': 'application/xml' }
})
  .then(response => {
    console.log("Raw Response from TallyPrime (Company List):");
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching company list:', error);
  });
