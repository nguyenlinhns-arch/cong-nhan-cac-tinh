import "./validate-utm-map-v3.mjs";
import fs from "node:fs";

const application = fs.readFileSync("tuyen-tho-mo/job-application.js", "utf8");
const errors = [];
for (const marker of [
  "let conditionPassTracked = false;",
  'assessment.key === "eligible" && !conditionPassTracked',
  'track("condition_pass"',
  'action: "application_condition_pass"',
  'journey_stage: "condition_pass"',
]) if (!application.includes(marker)) errors.push(`Biểu mẫu thiếu sự kiện đủ điều kiện sơ bộ: ${marker}`);

console.log(JSON.stringify({ application_condition_pass: errors.length === 0, errors }, null, 2));
if (errors.length) process.exit(1);