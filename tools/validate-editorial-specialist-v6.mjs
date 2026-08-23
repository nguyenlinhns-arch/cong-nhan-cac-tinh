// Compatibility entrypoint for existing CI wiring.
// v7 validates structure/prose; v8 validates whether each article actually
// behaves like its declared editorial genre (explainer vs analysis).
await import("./validate-editorial-specialist-v7.mjs");
await import("./validate-editorial-specialist-v8-depth.mjs");
