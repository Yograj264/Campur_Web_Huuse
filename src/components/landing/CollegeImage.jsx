import { useState } from "react";
import { LandingIcon } from "./LandingIcon";

export function CollegeImage({ college }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="connect-college-image">
      {college.image && !failed ? (
        <img
          src={college.image}
          alt={college.altText || `${college.name} campus`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="connect-campus-placeholder">
          <LandingIcon name="building" size={62} />
          <span>Campus preview unavailable</span>
        </div>
      )}
    </div>
  );
}
