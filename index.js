const axios = require('axios');
const xml2js = require('xml2js');

// URL for TallyPrime's API (default port is 9000)
const tallyAPIURL = 'http://localhost:9000';  // TallyPrime is running on port 9000

// Simple XML request to test TallyPrime connection (Export Request)
const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
  <ENVELOPE>
    <HEADER>
      <TALLYREQUEST>Export</TALLYREQUEST>
    </HEADER>
    <BODY>
      <EXPORTDATA>
        <REQUESTDATA>
          <TALLYMESSAGE>
            <SINGLELINE>
              <NAME>Test</NAME>
            </SINGLELINE>
          </TALLYMESSAGE>
        </REQUESTDATA>
      </EXPORTDATA>
    </BODY>
  </ENVELOPE>`;

// Send POST request to TallyPrime to test the Export functionality
axios.post(tallyAPIURL, xmlRequest, {
  headers: { 'Content-Type': 'application/xml' }
})
  .then(response => {
    console.log("Raw Response from TallyPrime (Export Test):");
    console.log(response.data);

    // Parse the XML response into JSON
    xml2js.parseString(response.data, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
      } else {
        console.log('Parsed Response:', JSON.stringify(result, null, 2));
      }
    });
  })
  .catch(error => {
    console.error('Error fetching data from TallyPrime:', error);
  });
