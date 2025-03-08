const axios = require('axios');
const xml2js = require('xml2js');

// URL for TallyPrime's API (replace with your actual TallyPrime server and port if different)
const tallyAPIURL = 'http://localhost:9000';  // TallyPrime is running on port 9000

// XML request to list all companies
const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
  <ENVELOPE>
    <HEADER>
      <TALLYREQUEST>List Companies</TALLYREQUEST>
    </HEADER>
    <BODY>
      <REQUESTDATA>
        <TALLYMESSAGE>
          <LISTCOMPANIES>
            <COMPANY></COMPANY>  
          </LISTCOMPANIES>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </BODY>
  </ENVELOPE>`;

// Send POST request to TallyPrime to fetch the company list
axios.post(tallyAPIURL, xmlRequest, {
  headers: { 'Content-Type': 'application/xml' }
})
  .then(response => {
    // Log the raw response to verify TallyPrime is receiving the request
    console.log("Raw Response from TallyPrime (Company List):");
    console.log(response.data);

    // Parse the XML response into JSON to extract and display data
    xml2js.parseString(response.data, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
      } else {
        console.log('Parsed Response:', JSON.stringify(result, null, 2));

        // Extract and log the list of companies
        if (result && result.ENVELOPE && result.ENVELOPE.BODY && result.ENVELOPE.BODY.RESPONSEDATA) {
          const companies = result.ENVELOPE.BODY.RESPONSEDATA[0].TALLYMESSAGE[0].LISTCOMPANIES[0].COMPANY;
          if (companies) {
            console.log('List of Companies in Tally:');
            companies.forEach(company => {
              console.log(company);
            });
          } else {
            console.log('No companies found.');
          }
        } else {
          console.log('Unable to parse company list from response.');
        }
      }
    });
  })
  .catch(error => {
    console.error('Error fetching data from TallyPrime:', error);
  });
