# illuminate-extract

# extract from Jira to a .json file
run node extract <username> <password> <Jira Project Code> <URL to Jira>

output will be  <Jira Project Code>.json

# process .json extract of Jira data and load in Mongo
run node processExtract.js <filename>

Mongo must be running and available.  Edit file to configure remote db.
