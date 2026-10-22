/** Normalize optional admin-managed college details without inventing figures. */
export function collegeDetails(college) {
  const text = (value) =>
    typeof value === "string" || typeof value === "number" ? String(value) : "";
  const courses = Array.isArray(college.courses)
    ? college.courses
        .map((course) =>
          typeof course === "string" ? { name: course } : course,
        )
        .filter((course) => course && text(course.name))
        .map((course) => ({
          name: text(course.name),
          description: text(course.description),
          duration: text(course.duration),
          fee: text(course.annualFee || course.fee),
          eligibility: text(course.eligibility),
        }))
    : String(college.programs || "")
        .split(",")
        .map((name) => ({ name: name.trim() }))
        .filter((course) => course.name);
  const reviews = Array.isArray(college.reviews)
    ? college.reviews
        .filter(
          (review) =>
            review &&
            typeof review === "object" &&
            text(review.body || review.comment),
        )
        .map((review) => ({
          name: text(review.name || review.author?.name || "Student"),
          body: text(review.body || review.comment),
          course: text(review.course),
          rating:
            Number(review.rating) > 0 && Number(review.rating) <= 5
              ? Number(review.rating)
              : null,
        }))
    : [];
  const facilities = Array.isArray(college.facilities)
    ? college.facilities
        .map((item) => (typeof item === "string" ? item : text(item?.name)))
        .filter(Boolean)
    : [];
  const recruiters = Array.isArray(college.recruiters)
    ? college.recruiters
        .map((item) => (typeof item === "string" ? item : text(item?.name)))
        .filter(Boolean)
    : [];
  return {
    courses,
    reviews,
    facilities,
    recruiters,
    description: text(college.description),
    address: text(college.address || college.subLocation || college.location),
    admissions: text(college.admissions),
    hostel: text(college.hostel),
    campusLife: text(college.campusLife),
  };
}

export function readCollegeShortlist() {
  try {
    const values = JSON.parse(
      localStorage.getItem("campus-college-shortlist") || "[]",
    );
    return Array.isArray(values)
      ? values.filter((id) => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}
