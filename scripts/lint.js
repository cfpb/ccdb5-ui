const esLintCLI = require( 'esLint/lib/cli' );
const minimist = require( 'minimist' );
const args = JSON.parse( process.env.npm_config_argv ).original.slice( 2 );

// TODO: Move to a config file.
const linterFiles = {
  _:      [ './src/**/*.jsx', './config/**/*.js', './scripts/**/*.js' ]
};

const linterArgs = minimist( args );

if ( Array.isArray( linterArgs._ ) && linterArgs._.length === 0 ) {
  delete linterArgs._;
}

const eslintOptions = Object.assign( linterFiles, linterArgs );

esLintCLI.execute( eslintOptions );
