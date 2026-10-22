import assert from "node:assert/strict";
import {
  collegeDetails,
  readCollegeShortlist,
} from "../src/data/collegeDetails.js";
const sparse = collegeDetails({ name: "College", programs: "B.Tech, MCA" });
assert.equal(sparse.courses.length, 2);
assert.equal(sparse.courses[0].duration, undefined);
assert.deepEqual(sparse.facilities, []);
assert.deepEqual(sparse.reviews, []);
const full = collegeDetails({
  courses: [
    { name: "MCA", duration: "2 years", annualFee: "INR 2 lakh" },
    null,
    {},
  ],
  facilities: ["Library", { name: "Wi-Fi" }, null],
  reviews: [
    { name: "Student", body: "Helpful teaching.", rating: 4.5 },
    { body: "Invalid rating.", rating: 99 },
  ],
  recruiters: ["Example Company"],
  address: "Pune",
});
assert.equal(full.courses[0].fee, "INR 2 lakh");
assert.equal(full.courses.length, 1);
assert.deepEqual(full.facilities, ["Library", "Wi-Fi"]);
assert.equal(full.reviews[0].rating, 4.5);
assert.equal(full.reviews[1].rating, null);
assert.equal(full.address, "Pune");
globalThis.localStorage = { getItem: () => "{invalid" };
assert.deepEqual(readCollegeShortlist(), []);
globalThis.localStorage = { getItem: () => '{"not":"an array"}' };
assert.deepEqual(readCollegeShortlist(), []);
globalThis.localStorage = { getItem: () => '["iit-delhi",null,3]' };
assert.deepEqual(readCollegeShortlist(), ["iit-delhi"]);
console.log("College detail normalization and shortlist checks passed.");
