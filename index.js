const axios = require('axios');
const xml2js = require('xml2js');

// URL for TallyPrime's API
const tallyAPIURL = 'http://localhost:9999';  // Replace with your Tally server URL and port

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
            <COMPANY></COMPANY>  <!-- Empty tag to list all companies -->
          </LISTCOMPANIES>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </BODY>
  </ENVELOPE>`;

// Send POST request to fetch the list of companies
axios.post(tallyAPIURL, xmlRequest, {
  headers: {
    'Content-Type': 'application/xml'
  }
})
  .then(response => {
    // Log the raw response to check the company list data
    console.log("Raw Response from TallyPrime (Company List):");
    console.log(response.data);

    // Parse the XML response into JSON to easily extract the company names
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
    console.error('Error fetching company list:', error);
  });
