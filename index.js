const axios = require('axios');
const xml2js = require('xml2js');

const tallyAPIURL = 'http://localhost:9000';

const companyListRequest = `<?xml version="1.0"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
    <VERSION>1</VERSION>
    <AUTH>CITYSTYLE:Safas2023</AUTH> <!-- Added credentials -->
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Company Information</REPORTNAME>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        </STATICVARIABLES>
        <DESC>
          <FETCH>Company</FETCH> <!-- Directly fetch Company object -->
        </DESC>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>`;

axios.post(tallyAPIURL, companyListRequest, {
  headers: { 'Content-Type': 'application/xml' }
})
.then(response => {
  const parser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: true,
    trim: true
  });

  parser.parseString(response.data, (err, result) => {
    if (err) {
      console.error('XML Parse Error:', err);
      return;
    }

    // Debug: Show full parsed response
    console.log('Full Response:', JSON.stringify(result, null, 2));

    // Extract companies
    if (result?.ENVELOPE?.BODY?.DATA?.COLLECTION?.COMPANY) {
      const companies = result.ENVELOPE.BODY.DATA.COLLECTION.COMPANY;
      console.log('Company List:', companies);
    } else {
      console.log('No companies found. Possible issues:');
      console.log('- Check TALLYREQUEST tag syntax');
      console.log('- Verify username/password are correct');
      console.log('- Ensure Tally Prime is running with API access enabled');
    }
  });
})
.catch(error => {
  console.error('Request Failed:', error.message);
});