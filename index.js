const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json()) // << สำคัญมาก ต้องมี!
// Set the port
const PORT = process.env.PORT || 3000;
// Set headers for all responses
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

require("./routes/login.routes")(app);
require("./routes/taro.routes")(app);
require("./routes/user.routes")(app);
require("./routes/redeem.routes")(app);