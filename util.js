function blockFor(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Busy-wait loop (this blocks the event loop)
  }
}

function parseAcceptEncodingHeader(encodings) {
let encodingList = encodings.split(",")
let trimmedList = encodingList.map(item => item.trim());

return trimmedList
}

module.exports = {
blockFor,
parseAcceptEncodingHeader
};