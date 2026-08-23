const gates = [
  "./validate-canonical-recruitment-facts-v11.mjs",
  "./validate-province-current-facts-v11.mjs",
  "./validate-province-metadata-facts-v11.mjs",
  "./validate-province-indexing-integrity-v11.mjs",
  "./validate-paid-search-runtime-v11.mjs",
  "./validate-machine-feeds-v11.mjs",
];

for (const gate of gates) {
  await import(gate);
  if (process.exitCode && process.exitCode !== 0) {
    console.error(`Recruitment distribution gate failed at ${gate}`);
    break;
  }
}

if (!process.exitCode) {
  console.log(JSON.stringify({
    status: "recruitment-distribution-v11-ready",
    gates,
  }, null, 2));
}
