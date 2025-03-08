const axios = require('axios');
const xml2js = require('xml2js');

const tallyAPIURL = 'http://localhost:9000';

// Correct XML request to list companies
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
        </STATICVARIABLES>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>`;

axios.post(tallyAPIURL, companyListRequest, {
  headers: { 'Content-Type': 'application/xml' }
})
.then(response => {
  console.log("Raw Response:");
  console.log(response.data);

  // Configure XML parser
  const parser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: true
  });

  parser.parseString(response.data, (err, result) => {
    if (err) {
      console.error('XML Parse Error:', err);
      return;
    }
    
    if (result?.ENVELOPE?.BODY?.DATA?.COLLECTION?.COMPANY) {
      const companies = result.ENVELOPE.BODY.DATA.COLLECTION.COMPANY;
      console.log('Company List:', companies);
    } else {
      console.log('No companies found or invalid response structure');
    }
  });
})
.catch(error => {
  console.error('Request Failed:', error.message);
});