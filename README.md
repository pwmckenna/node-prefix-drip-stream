node-prefix-drip-stream
=======================

# How
Given a prefix, this read/write stream will pre-emptively write small increments ("drip") until actual content is written to the stream.

# Why
The primary use case is to get around things like Heroku's connection timeout (which will die if no data is transferred for 30 seconds). If you have an image manipulation service with a known header, you can write bits of it out in order to buy yourself time.

# Example
```js
var request = require('request');
var PrefixDripStream = require('prefix-drip-stream');
var PNG_HEADER = new Buffer('89504e470d0a1a0a', 'hex');
var IMAGE_URL = 'http://upload.wikimedia.org/wikipedia/en/1/13/S3_Graphics_Logo.png';
// pre-emptivly write a bit of the png header every second until we get actual data
var drip = new PrefixDripStream(PNG_HEADER, 1000);

app.get('/', function (req, res) {
  request(IMAGE_URL).pipe(drip).pipe(res);
});
```

# Warnings
- If you're using this to get around heroku's 30s timeout, you should probably follow their advice and move the processing into a background task...The only reason I went this route is it saved having to use a database entirely.
- Be certain that you know that the prefix you specify is the first data that will be written to your pipe...otherwise you've just corrupted your data.
