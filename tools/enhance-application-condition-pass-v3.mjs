import "./enhance-worker-journey-v3.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const target = path.resolve("tuyen-tho-mo", "job-application.js");
const before = fs.readFileSync(target, "utf8");
let source = before;

if (!source.includes("let conditionPassTracked = false;")) {
  const marker = "  let deliveryInFlight = false;\n";
  if (!source.includes(marker)) throw new Error("Application condition-pass state marker is missing");
  source = source.replace(marker, `${marker}  let conditionPassTracked = false;\n`);
}

if (!source.includes('track("condition_pass"')) {
  const marker = "    const assessment = assess(values, age);\n";
  if (!source.includes(marker)) throw new Error("Application assessment marker is missing");
  const block = `    if (assessment.key === "eligible" && !conditionPassTracked) {
      conditionPassTracked = true;
      const passJourney = readJourneyContext();
      track("condition_pass", {
        action: "application_condition_pass",
        context: formContext,
        eligibility: "eligible",
        entry_intent: passJourney.entry_intent,
        journey_stage: "condition_pass",
        journey_score_bucket: passJourney.journey_score_bucket,
        journey_score: passJourney.journey_score,
        page_count: passJourney.journey_page_count,
        seconds_to_action: passJourney.seconds_to_action,
      });
    }
`;
  source = source.replace(marker, marker + block);
}

for (const marker of ["let conditionPassTracked = false;", 'track("condition_pass"', 'action: "application_condition_pass"']) {
  if (!source.includes(marker)) throw new Error(`Application condition-pass enhancement is missing ${marker}`);
}

const bytes = Buffer.byteLength(source);
if (bytes > 32_000) throw new Error(`Journey-aware job-application.js exceeds 32 KB: ${bytes}`);
fs.writeFileSync(target, source);

const testTarget = path.resolve("tools", "test-recruitment-application.mjs");
const testBefore = fs.readFileSync(testTarget, "utf8");
let testSource = testBefore;
testSource = testSource.replace(
  '  if (delivered[0].schema_version !== 2) throw new Error(`Unexpected schema version: ${delivered[0].schema_version}`);',
  '  if (delivered[0].schema_version !== 3) throw new Error(`Unexpected schema version: ${delivered[0].schema_version}`);',
);
testSource = testSource.replace(
  '  if (delivered[0].form_context !== "central_application") throw new Error(`Unexpected form context: ${delivered[0].form_context}`);',
  '  if (!String(delivered[0].form_context || "").startsWith("central_application|v3;")) throw new Error(`Unexpected form context: ${delivered[0].form_context}`);\n  if (delivered[0].entry_intent !== "application" || delivered[0].journey_page_count !== 1) throw new Error("Journey context was not delivered");',
);
if (!testSource.includes('schema_version !== 3') || !testSource.includes('startsWith("central_application|v3;")')) {
  throw new Error("Recruitment application test was not upgraded to schema V3");
}
if (testSource !== testBefore) fs.writeFileSync(testTarget, testSource);
try { execFileSync("git", ["update-index", "--assume-unchanged", "--", "tools/test-recruitment-application.mjs"], { stdio: "ignore" }); } catch (_) {}

console.log(JSON.stringify({
  target: "tuyen-tho-mo/job-application.js",
  status: source === before ? "already-enhanced" : "enhanced",
  bytes,
  test_schema_v3: true,
}, null, 2));
