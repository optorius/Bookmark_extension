const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');

const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');

require('dotenv').config();

const PORT = process.env.PORT || 5050;
const DB_URL = process.env.DB_URL;

const app = express();


// Middlewares:
app.use( express.json () );
app.use( cookieParser() );

// core:
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        // to allow or not the incoming origin
        if (origin.includes('moz-extension://')) return callback(null, true);

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use( '/', router );
app.use( errorMiddleware ); // должен идти последним из всех middle-ware

const start = async() =>
{
    try
    {
        console.log( "Trying to connect MongoDB..." )
        await mongoose.connect( DB_URL, {
            useNewUrlParser : true,
            useUnifiedTopology: true
        } )
        console.log( "Succesfully connected to MongoDB!" )
        app.listen( PORT, () => console.log( 'Server started on PORT %d', PORT ) );
    }
    catch ( e )
    {
        console.log( e );
    }
}

start();
