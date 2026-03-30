const express = require('express'); 
const path = require('path');
const { connectToMongoDB } = require('./connect');
const eventRoute  = require('./routes/eventDetails');
const userRoute = require('./routes/user');
const { checkForAuthentication, checkForAdmin } = require('./middlewares/auth');
const bookingRoute = require('./routes/booking');

const app = express();
const PORT = 8000;

connectToMongoDB("mongodb://localhost:27017/event-db")
  .then(() => console.log("MongoDB Connected."))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api',checkForAuthentication, checkForAdmin, eventRoute);
app.use('/user', userRoute);

app.use('/event', eventRoute);

// route to book ticket for an event
app.use('/book-ticket', checkForAuthentication, bookingRoute);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});