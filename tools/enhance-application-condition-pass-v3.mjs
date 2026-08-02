import "./enhance-worker-journey-v3.mjs";
import fs from "node:fs";
import path from "node:path";

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
console.log(JSON.stringify({ target: "tuyen-tho-mo/job-application.js", status: source === before ? "already-enhanced" : "enhanced", bytes }, null, 2));
