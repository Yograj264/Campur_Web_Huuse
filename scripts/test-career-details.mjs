import assert from "node:assert/strict";
import { ROADMAPS } from "../src/data/roadmaps.js";
import { CAREER_DETAILS, careerDetails } from "../src/data/careerDetails.js";
assert.equal(Object.keys(CAREER_DETAILS).length, ROADMAPS.length);
for (const roadmap of ROADMAPS) {
  const details = careerDetails(roadmap.id);
  assert.ok(details.role && details.tagline && details.about);
  assert.ok(details.skills.length >= 4);
  assert.ok(details.projects.length >= 3);
  assert.ok(details.degrees.length >= 3);
  assert.equal(
    new Set(details.degrees.map((degree) => degree.id)).size,
    details.degrees.length,
  );
  for (const resource of details.resources) {
    assert.equal(new URL(resource.url).protocol, "https:");
    assert.ok(resource.type && resource.description);
  }
  assert.equal("salary" in details, false);
}
assert.equal(
  careerDetails("missing-id"),
  CAREER_DETAILS["software-development"],
);
console.log(
  "All career plans, degree filters and resource links passed data checks.",
);
