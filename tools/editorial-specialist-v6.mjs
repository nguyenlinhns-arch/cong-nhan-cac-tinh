// Compatibility entrypoint: the publishing pipeline still calls this filename,
// but specialist articles are now rendered by the more flexible v7 newsroom
// structure. Keeping this shim avoids duplicating pipeline wiring.
await import("./editorial-specialist-v7.mjs");
