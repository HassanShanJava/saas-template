import React from "react";
import DocumentTitle from "./ui/common/document-title";

const PrivacyStatement: React.FC = () => {
  DocumentTitle("Privacy Policy")
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Privacy Statement</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
        lobortis, dolor eu pellentesque convallis, augue quam vehicula velit, et
        varius orci lacus a mi. Cras efficitur, erat vel bibendum ullamcorper,
        risus nisi vulputate lacus, id placerat ex nisl in leo. Phasellus
        vestibulum orci a turpis bibendum viverra.
      </p>
      <p>
        Vivamus sit amet odio vitae urna placerat cursus a at erat. Etiam
        volutpat, libero id euismod facilisis, libero ex gravida urna, sit amet
        accumsan justo felis et enim. Integer pretium nisi ac turpis suscipit,
        ac pulvinar urna laoreet.
      </p>
    </div>
  );
};

export default PrivacyStatement;
