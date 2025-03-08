const axios = require('axios');
const xml2js = require('xml2js');

// URL for TallyPrime's API
const tallyAPIURL = 'http://localhost:9999';  // Replace with your Tally server URL and port

// XML request to fetch product details
const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
  <ENVELOPE>
    <HEADER>
      <TALLYREQUEST>Export</TALLYREQUEST>
    </HEADER>
    <BODY>
      <EXPORTDATA>
        <REQUESTDATA>
          <TALLYMESSAGE>
            <PRODUCTDETAILS>
              <PRODUCT>
                <NAME>*</NAME> <!-- Fetch all products -->
              </PRODUCT>
            </PRODUCTDETAILS>
          </TALLYMESSAGE>
        </REQUESTDATA>
      </EXPORTDATA>
    </BODY>
  </ENVELOPE>`;

// Send POST request to fetch product details
axios.post(tallyAPIURL, xmlRequest, {
  headers: {
    'Content-Type': 'application/xml'
  }
})
  .then(response => {
    // Log the raw response data to check if it's valid XML or contains issues
    console.log("Raw Response from TallyPrime:");
    console.log(response.data);  // This will log the raw XML response from TallyPrime

    // Parse the XML response into JSON
    xml2js.parseString(response.data, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
      } else {
        console.log('Product Details:', JSON.stringify(result, null, 2));
      }
    });
  })
  .catch(error => {
    console.error('Error fetching product details:', error);
  });
