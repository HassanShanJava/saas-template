import { RootState } from "@/app/store";
import { extractLinks, getLinks } from "@/utils/helper";
import React from "react";
import { FaHome, FaFrown } from "react-icons/fa";
import { GiRollingDices } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useDocumentTitle from "./ui/common/document-title";

const NotFoundPage = () => {
  const orgId = useSelector(
    (state: RootState) => state.auth.userInfo?.org_id
  );
  useDocumentTitle("Page Not Found");
  const links = getLinks() || ['/']; // Return landing page as default;

  
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
      <Link to={'/admin/dashboard'} style={linkStyle} className="text-primar">
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
