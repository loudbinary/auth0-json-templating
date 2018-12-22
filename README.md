# auth0-json-templating

Purpose: Replace strings and arrays within JSON files exports by Auth0 Cli.

I'd found array replacement was haphazzard, and caused issues during native replacement.

Recursively, for each json file found in templateDirectory
 - Replace all values, matching ##ENVIRONMENT_VARIABLE## as string in file
 - Replace all values, matching @@ENVIRONMENT_VARIABLE@@ as array for parent object
   - Performing CSV split, and appending each item appropriately.
- If an expected replacement is found, and no matching Environment Variable, processing fails.
- Store json in saveDirectory
- Copy remaining .js and .html files into saveDirectory

For variable replacement of .js and .html, use native Auth0 Cli replacement.  I found this to work well.

Usage:
node app.js --templateDirectory <path to folder> --saveDirectory <save path> --envFile <path to envfile>

You may omit --envFile, by executing as
ENVKEY=<envkey> --templateDirectory <path to folder> --saveDirectory <save path> --envFile <path to envfile>

or, simply having ENVKEY exported into current shell, prior to executing node. 


