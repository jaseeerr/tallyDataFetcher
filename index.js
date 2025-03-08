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
            <COMPANY>
              <NAME>CITY STYLE GENERAL TRADING</NAME>
            </COMPANY>
            <PRODUCTDETAILS>
              <PRODUCT>
                <NAME>*</NAME>
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
