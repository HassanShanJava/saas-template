import { RootState } from "@/app/store";
import { extractLinks } from "@/utils/helper";
import React from "react";
import { FaHome, FaFrown } from "react-icons/fa";
import { GiRollingDices } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  const orgId = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_id
  );
  const sidepanel = localStorage.getItem("sidepanel");
  const decodedSidepanel = JSON.parse(atob(sidepanel as string));
  const filteredPanel = decodedSidepanel.filter((sidepanel: any) => {
    // If the parent has no children, handle based on the parent's access_type
    if (!sidepanel.children || sidepanel.children.length === 0) {
      return sidepanel.access_type !== "no_access";
    }

    // If the parent has children, filter out the children with access_type == "no_access"
    const filteredChildren = sidepanel.children.filter((child: any) => child.access_type !== "no_access");

    // If after filtering, no children are left, we filter out the parent as well
    if (filteredChildren.length === 0) {
      return false; // Filter out the parent if all children have "no_access"
    }

    // Otherwise, keep the parent and assign the filtered children
    sidepanel.children = filteredChildren;
    return true;
  });
  const links = extractLinks(filteredPanel)
  console.log({links})
  return (
    <div style={containerStyle}>
      <div style={iconContainerStyle}>
        <FaFrown style={iconStyle} />
        <GiRollingDices style={iconStyle} />
      </div>
      <h1 style={headingStyle}>Oops! Page Not Found</h1>
      <p style={messageStyle}>
        It seems like the page you're looking for doesn't exist.
      </p>
      <Link to={orgId == 21 ? "/admin/dashboard" : links[0]} style={linkStyle} className="text-primar">
        <FaHome style={homeIconStyle} className="text-primary" />{" "}
        <span className="text-primary">Go back to Home</span>
      </Link>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center",
  padding: "20px",
  backgroundColor: "#f5f5f5",
};

const iconContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const iconStyle: React.CSSProperties = {
  fontSize: "3rem",
  margin: "0 10px",
  color: "#888",
};

const headingStyle: React.CSSProperties = {
  fontSize: "2rem",
  marginBottom: "10px",
  color: "#333",
};

const messageStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  marginBottom: "20px",
  color: "#666",
};

const linkStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  textDecoration: "none",
  color: "#007bff",
  display: "flex",
  alignItems: "center",
};

const homeIconStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  marginRight: "8px",
};

export default NotFoundPage;
