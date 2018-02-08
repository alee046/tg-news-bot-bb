const express = require( 'express' );
const packageInfo = require( './package.json' );
const tokens = require( './config.js' );
const app = express();
const bodyParser = require( 'body-parser' );

app.use( bodyParser.json() );

app.get( '/', ( req, res ) => {
  res.json( { version: packageInfo.version } );
});

app.post( '/' + tokens.botToken, ( req, res ) => {
  // bot.processUpdate(req.body);
  res.json(res.getBody());
  res.sendStatus( 200 );
});

const server = app.listen( ( process.env.PORT || 5000 ), () => {
	const host = server.address().address;
	const port = server.address().port;

	console.log( 'Web server started at http://%s:%s', host, port );
});