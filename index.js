const axios = require('axios');
const xml2js = require('xml2js');

const tallyAPIURL = 'http://localhost:9000';

// Correct XML to fetch company list
const companyListRequest = `<?xml version="1.0"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>List of Companies</REPORTNAME>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
          <!-- Use COMPANY instead of REPORTNAME if above fails -->
          <DESC> <!-- Add this block -->
            <TDL>
              <TDLMESSAGE>
                <COLLECTION NAME="CompanyList">
                  <TYPE>Company</TYPE>
                </COLLECTION>
              </TDLMESSAGE>
            </TDL>
          </DESC>
        </STATICVARIABLES>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>`;

axios.post(tallyAPIURL, companyListRequest, {
  headers: { 'Content-Type': 'application/xml' }
})
.then(response => {
  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
  parser.parseString(response.data, (err, result) => {
    if (err) {
      console.error('XML Parse Error:', err);
      return;
    }

    // Handle Tally's response structure
    if (result?.ENVELOPE?.BODY?.DATA?.COLLECTION?.COMPANY) {
      const companies = result.ENVELOPE.BODY.DATA.COLLECTION.COMPANY;
      console.log('Company List:', JSON.stringify(companies, null, 2));
    } else {
      console.log('No companies found. Check Tally configuration!');
    }
  });
})
.catch(error => {
  console.error('Request Failed:', error.message);
});