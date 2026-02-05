require('dotenv').config({ path: './myConfig.env' }); // Load variables from myConfig.env

const express = require('express');
// const mysql = require('mysql2');
const nodemailer = require("nodemailer");
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const fetch = require('node-fetch');
const multer = require('multer');
const upload = multer();



// Middleware
const app = express();
const port = process.env.PORT || 8800; // Fallback to 8800 if env not defined

app.use(cors());
app.use(express.json());


// Create MySQL connection

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });


// db.connect(err => {
//   if (err) throw err;
  // console.log('✅ MySQL Connected');
// });


app.get("/api/volvo/scores", async (req, res) => {
  try {
    const { starttime, stoptime } = req.query;

    if (!starttime || !stoptime) {
      return res.status(400).json({ error: "Missing date range" });
    }

    const auth = Buffer.from(
      `${process.env.VOLVO_USERNAME}:${process.env.VOLVO_PASSWORD}`
    ).toString("base64");

    const response = await fetch(
      `https://api.volvotrucks.com/score/scores?contentFilter=VEHICLES&driverIdType=Tacho&starttime=${starttime}&stoptime=${stoptime}`,
      {
        headers: {
          Accept: "application/x.volvogroup.com.scores.v2.0+json; UTF-8",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    // console.error("Volvo API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



/**
 * ✅ Volvo Pagination Proxy
 */
app.get("/api/volvo/proxy", async (req, res) => {
  try {
    const { path } = req.query;
    
    // console.log("📥 Volvo Proxy - Received path:", path);

    if (!path) {
      return res.status(400).json({ error: "Path parameter is required" });
    }

    const auth = Buffer.from(
      `${process.env.VOLVO_USERNAME}:${process.env.VOLVO_PASSWORD}`
    ).toString("base64");

    // console.log("🌐 Calling Volvo API:", `https://api.volvotrucks.com${path}`);

    const response = await fetch(`https://api.volvotrucks.com${path}`, {
      headers: {
        Accept: "application/x.volvogroup.com.scores.v2.0+json; UTF-8",
        Authorization: `Basic ${auth}`,
      },
    });

    // console.log("📡 Volvo Proxy Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      // console.error("❌ Volvo Proxy Error:", response.status, errorText);
      return res.status(response.status).json({ 
        error: `Volvo API Error: ${response.status}`,
        details: errorText 
      });
    }

    const data = await response.json();
    // console.log("✅ Volvo Proxy data received successfully");
    res.json(data);

  } catch (err) {
    // console.error("💥 Volvo Proxy Server Error:", err.message);
    // console.error("Stack:", err.stack);
    res.status(500).json({ 
      error: "Pagination failed", 
      details: err.message 
    });
  }
});



// Initial RFMS vehicles endpoint
app.get("/api/rfms/vehicles", async (req, res) => {
  try {
    const auth = Buffer.from(
      `${process.env.VOLVO_USERNAME}:${process.env.VOLVO_PASSWORD}`
    ).toString("base64");

    const response = await fetch(
      `https://api.volvotrucks.com/vehicle/vehicles?additionalContent=VOLVOGROUPVEHICLE`,
      {
        headers: {
          Accept: "application/x.volvogroup.com.vehicles.v1.0+json; UTF-8",
          Authorization: `Basic ${auth}`,
        },
      }
    );


    const data = await response.json();
    res.json(data);
  } catch (err) {
    // console.error("RFMS API Error:", err);
    res.status(500).json({ error: "Failed to fetch RFMS vehicles" });
  }
});

// RFMS pagination proxy
app.get("/api/rfms/proxy", async (req, res) => {
  try {
    const { path } = req.query;
    const auth = Buffer.from(
      `${process.env.VOLVO_USERNAME}:${process.env.VOLVO_PASSWORD}`
    ).toString("base64");

    const response = await fetch(`https://api.volvotrucks.com${path}`, {
      headers: {
        Accept: "application/x.volvogroup.com.vehicles.v1.0+json; UTF-8",
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "RFMS Pagination failed" });
  }
});


/**
 * ✅ Get RFMS Vehicle Statuses (Initial call) - FIXED
 */


app.get("/api/rfms2/vehiclestatuses", async (req, res) => {
  try {
    const { starttime, stoptime, datetype, contentFilter, latestOnly } = req.query;
    
    // console.log("📥 Received params:", { starttime, stoptime, datetype, contentFilter, latestOnly });
    
    const auth = Buffer.from(
      `${process.env.VOLVO_USERNAME}:${process.env.VOLVO_PASSWORD}`
    ).toString("base64");

    // Build URL with proper encoding
    const params = [];
    if (latestOnly !== undefined) params.push(`latestOnly=${latestOnly}`);
    if (contentFilter) params.push(`contentFilter=${contentFilter}`);
    if (datetype) params.push(`datetype=${datetype}`);
    if (stoptime) params.push(`stoptime=${encodeURIComponent(stoptime)}`);
    if (starttime) params.push(`starttime=${encodeURIComponent(starttime)}`);
    
    const url = `https://api.volvotrucks.com/rfms/vehiclestatuses?${params.join('&')}`;
    
    // console.log("🌐 Calling Volvo API:", url);

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.fmsstandard.com.vehiclestatuses.v2.1+json",
        Authorization: `Basic ${auth}`,
      },
    });

    // console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      // console.error("❌ API Response Error:", response.status, errorText);
      return res.status(response.status).json({ 
        error: `Volvo API Error: ${response.status}`,
        details: errorText,
        url: url
      });
    }

    const data = await response.json();
    // console.log("✅ Vehicle Statuses data received, records:", data?.VehicleStatus?.length || 0);
    res.json(data);

  } catch (err) {
    // console.error("💥 Server Error:", err.message);
    res.status(500).json({ 
      error: "Failed to fetch vehicle statuses", 
      details: err.message
    });
  }
});


app.get("/api/rfms2/proxy", async (req, res) => {
  try {
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ error: "Path parameter is required" });
    }

    const auth = Buffer.from(
      `${process.env.VOLVO_USERNAME}:${process.env.VOLVO_PASSWORD}`
    ).toString("base64");

    // console.log("🟡 RFMS2 Proxy received path:", path);

    // Parse the path to extract all query parameters
    // const urlObj = new URL(`https://api.volvotrucks.com${path}`);
    
    // Log all extracted params
    // console.log("📥 Extracted params from path:", {
    //   starttime: urlObj.searchParams.get('starttime'),
    //   stoptime: urlObj.searchParams.get('stoptime'),
    //   datetype: urlObj.searchParams.get('datetype'),
    //   contentFilter: urlObj.searchParams.get('contentFilter'),
    //   latestOnly: urlObj.searchParams.get('latestOnly'),
    //   lastVin: urlObj.searchParams.get('lastVin')
    // });
    
    // Use the full URL as constructed from the path
    const apiUrl = `https://api.volvotrucks.com${path}`;
    
    // console.log("🌐 Calling Volvo API:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.fmsstandard.com.vehiclestatuses.v2.1+json",
        Authorization: `Basic ${auth}`,
      },
    });

    // console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      // console.error("❌ Proxy Error:", response.status, errorText);
      return res.status(response.status).json({ 
        error: `Proxy Error: ${response.status}`,
        details: errorText,
        url: apiUrl
      });
    }

    const data = await response.json();
    // console.log("✅ Vehicle Statuses received:", data?.VehicleStatus?.length || 0, "records");
    res.json(data);

  } catch (err) {
    // console.error("💥 RFMS2 Pagination Error:", err);
    res.status(500).json({ 
      error: "RFMS2 Pagination failed", 
      details: err.message 
    });
  }
});



// Health check endpoint

app.get('/', (req, res) => {
  // res.send('🚀 API is running');
});

// GET all users

// app.get('/users', (req, res) => {
//   db.query('SELECT * FROM user', (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(results);
//   });
// });

// Global error handler (optional)

// app.use((err, req, res, next) => {
//   // console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

//////////////////////////////////////////////////////////////////////////////////////////////////
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   db.query('SELECT * FROM user WHERE name = ? AND password = ?', [username, password], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (results.length > 0) {
//       res.json({ success: true, user: results[0] });
//     } else {
//       res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }
//   });
// });

////////////////////////////CREATE NEW USER ID//////////////////////////////////////////////////
//   app.post('/create_user', (req, res) => {
//   // ❌ You can't use `alert` in server-side Node.js — it's a browser function
//   // console.log('Creating new user in server.js');

//   const { userid, name, email, password, usrrole } = req.body;

//   // ✅ Fix: 5 columns need 5 placeholders
//   const sql = 'INSERT INTO `user` (`userid`, `name`, `email`, `password`, `usrrole`) VALUES (?, ?, ?, ?, ?)';

//   // ✅ Fix: Provide each value in the array separately, not as a single string
//   const values = [userid, name, email, password, usrrole];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       // console.error('❌ Error inserting data:', err);
//       res.status(500).json({ success: false, error: err.message });
//       return;
//     }

//     // console.log('✅ Data inserted successfully:');
//           res.status(200).json({ success: true, message: 'User created successfully!' });
//   });
// });

////////////////////////////CREATE NEW USER ID//////////////////////////////////////////////////////
// app.post("/send-email", async (req, res) => {
// // alert(`send to mail ${req.body}`);

//   const { to, subject, text } = req.body;

//   const transporter = nodemailer.createTransport({
//     host: "smtp.ampl.in",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "sap.development@ampl.in", // full email
//       pass: process.env.MAIL_PASS,     // store password in .env
//     },
//   });

//   try {
//     await transporter.sendMail({
//       from: '"SAP Dev Team" <sap.development@ampl.in>',
//       to,
//       subject,
//       text,
//     });

//     res.status(200).send("Mail sent successfully");
//   } catch (err) {
//     // console.error(err);
//     res.status(500).send("Failed to send mail");
//   }
// });

//////////////////////////////////////////////////////////////////////////////////////////////////
// app.post('/apiTesting', upload.single('file'), async (req, res) => {
//   try {

//     const {serverUrl, odataService, method, apiBody, isPost } = req.body;
//     const file = req.file;

//     // const fullUrl = 'https://amwebdisp.ampl.in:44390/sap/opu/odata/sap/ZCWS_WMS_ODATA_SRV/ZDEEP_DATASet/' ;
   
//     const fullUrl = `${serverUrl}${odataService}${method} `;
   
    
//     let headers;

//     if (serverUrl.includes('44390')) {
//       // DEV credentials
//       headers = {
//         'Accept': 'application/json',
//         'Authorization': 'Basic ' + Buffer.from(`${process.env.ODATA_DEV_USER}:${process.env.ODATA_DEV_PASS}`).toString('base64')
//       };
//     } else if (serverUrl.includes('44380')) {
//       // PRD credentials
//       headers = {
//         'Accept': 'application/json',
//         'Authorization': 'Basic ' + Buffer.from(`${process.env.ODATA_PRD_USER}:${process.env.ODATA_PRD_PASS}`).toString('base64')
//       };
//     } else {
//       return res.status(400).json({ error: 'Unknown server environment based on URL' });
//     }



//     let csrfToken = '';
//     if (isPost === 'true') {
//       const tokenResp = await fetch(odataService, {
//         method: 'GET',
//         headers: { ...headers, 'X-CSRF-Token': 'Fetch' }
//       });
//       csrfToken = tokenResp.headers.get('x-csrf-token');
//       headers['X-CSRF-Token'] = csrfToken;
//     }

//     let body = null;
//     if (file) {
//       // Handle file uploads here if needed
//     } else if (apiBody) {
//       headers['Content-Type'] = 'application/json';
//       body = apiBody;
//     }
// //////////////////////////////////////////////////////////////////////////////////
//     const resp = await fetch(fullUrl, {
//       method: isPost === 'true' ? 'POST' : 'GET',
//       headers,
//       body: isPost === 'true' ? body : null
//     });
// //////////////////////////////////////////////////////////////////////////////////

//     const json = await resp.json();
//     res.status(resp.status).json(json);

//   } catch (err) {
//     // console.error('OData Proxy Error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

app.listen(port, () => {
  // console.log(`🚀 Server is running on port ${port}`);
});


