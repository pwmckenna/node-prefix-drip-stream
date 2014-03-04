node-prefix-drip-stream
=======================

Given a prefix, this read/write stream will pre-emptively write small increments ("drip") until actual content is written to the stream.

The primary use case is to get around things like Heroku's 30s connection timeout. If you have an image manipulation service with a known header, you can write bits of it out in order to not time out while you complete the operation.
