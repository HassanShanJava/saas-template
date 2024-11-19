import React from "react";
import useDocumentTitle from "./ui/common/document-title";

const TermsAndConditions: React.FC = () => {
  useDocumentTitle("Terms & Conditions")
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Terms & Conditions</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
        venenatis, ligula eu fermentum laoreet, neque felis consequat lectus, id
        fermentum sapien justo nec lorem. Quisque maximus purus non tellus
        finibus, vel fringilla odio eleifend. Mauris venenatis, odio in bibendum
        congue, lectus risus dapibus leo, sit amet hendrerit lorem lacus ac mi.
      </p>
      <p>
        Cras rutrum erat nec est tempus efficitur. Maecenas faucibus mollis
        ultricies. Suspendisse et purus metus. Nullam in lacus at dui efficitur
        posuere nec eget nisi. Ut tempor sapien ut nibh suscipit tristique.
      </p>
    </div>
  );
};

export default TermsAndConditions;
