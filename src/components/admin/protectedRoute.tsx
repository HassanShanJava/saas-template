import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {  
  const [sidePanel, setSidePanel] = useState<string[]>([]);
  const sidepanel = localStorage.getItem("sidepanel");

  useEffect(() => {
    if (sidepanel) {
      try {
        const decodedSidepanel = JSON.parse(atob(sidepanel));
        console.log({ decodedSidepanel });
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
        setSidePanel(links);
      } catch (error) {
        console.error("Error decoding Base64 string:", error);
      }
    }
  }, [sidepanel]);
  
  const navigate=useNavigate()
  const isAuthenticated = Boolean(localStorage.getItem("userToken"));
  const location = useLocation();
  console.log({ sidePanel }, sidePanel.some(link=>link==location.pathname))
  // Redirect to login if not authenticated and trying to access a protected route
  if (!isAuthenticated && location.pathname !== "/") {
    return <Navigate to="/" />;
  }

  // Redirect to dashboard if authenticated and trying to access the login page
  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to={sidePanel[0]} />;
  }

  // Check if the current path is not in the links array and redirect to the first available link
  if (isAuthenticated && !sidePanel.some(link=>link==location.pathname)) {
    navigate("/notfound")
    // window.location.assign('/notfound')
  }

  return <Outlet />;
};


// Function to extract all links
function extractLinks(data: any[]) {
  let links: string[] = [];

  data.forEach((item: any) => {
    if (item.link && item.link != '/') {
      links.push(item.link); // Add current link
    }

    // Recursively extract links from children if any
    if (item.children && item.children.length > 0) {
      links = links.concat(extractLinks(item.children));
    }
  });

  return links;
}


export default ProtectedRoute;
