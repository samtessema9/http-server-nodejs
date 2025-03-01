function blockFor(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {
      // Busy-wait loop (this blocks the event loop)
    }
}

module.exports = blockFor;