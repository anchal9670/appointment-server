const express = require("express");
const dotenv = require("dotenv");
const database = require("./db/database");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cookieSession = require("cookie-session");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");


dotenv.config({ path: "config/.env" });

app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:3000", "http://localhost:5173", "https://prepeat.in", "https://admin.prepeat.in", "*"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.raw({ limit: "10mb", type: "image/*" }));

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const nutriRoutes = require('./routes/nutritionistRoutes');
const addressRoutes = require('./routes/addressRoutes');
const goalRoutes = require('./routes/goalRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const storage = require("./routes/storage");


const PORT = process.env.PORT || 6000;
database.connect();
console.log(process.env.PORT);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
app.use('/api/v1', authRoutes);
app.use('/api/v1',profileRoutes);
app.use('/api/v1',nutriRoutes);
app.use('/api/v1',addressRoutes);
app.use('/api/v1',goalRoutes);
app.use('/api/v1',appointmentRoutes);
app.use('/api/v1',storage);

app.use(
  cookieSession({
    name: "session", // Name of the cookie
    keys: [process.env.COOKIE_SECRET || "defaultsecret"], // Array of secret keys
    maxAge: 24 * 60 * 60 * 1000, // Session duration in milliseconds (1 day in this example)
    secure: false, // Set to true if your app is served over HTTPS
  })
);


app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
