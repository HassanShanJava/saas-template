import React, { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { createJWT, extractLinks } from "@/utils/helper";
import logomainsvg from "@/assets/logo-main.svg";
import { useGetValidateUserQuery } from "@/services/userApi";
import { toast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import useDocumentTitle from "@/components/ui/common/document-title";

const QRCodePage: React.FC = () => {
  const [token, setToken] = React.useState<string | null>(null);

  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  // Redirect to `/` if `userToken` is missing
  useEffect(() => {
    if (!userToken) {
      navigate("/");
      return;
    }
  }, [userToken, navigate]);

  // Safely parse `sidepanel` from localStorage
  let links: string[] = [];
  try {
    const sidepanel = localStorage.getItem("sidepanel");
    const decodedSidepanel = sidepanel ? JSON.parse(atob(sidepanel)) : null;
    links = decodedSidepanel ? extractLinks(decodedSidepanel) : [];
  } catch (error) {
    console.error("Error parsing sidepanel:", error);
    links = [];
  }
  // Extract user info from localStorage and set JWT payload
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const payload = {
    id: userInfo.user?.id,
    user_type: "staff",
    org_id: userInfo.user?.org_id,
    created_on: new Date().toISOString(),
  };

  useEffect(() => {
    const generateAndSetToken = async () => {
      const jwt = await createJWT(payload);
      setToken(jwt);
    };

    // Call once immediately to generate the initial token
    generateAndSetToken();

    // Set an interval to regenerate the token every 15 seconds
    const intervalId = setInterval(() => {
      generateAndSetToken();
    }, 15000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  const [isChecking, setIsChecking] = React.useState(true);
  const userId = useSelector(
    (state: RootState) => state.auth.userInfo?.user.id
  );
  const {
    data: staffvalidation,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetValidateUserQuery(
    {
      user_id: userId as number,
    },
    {
      skip: userId == undefined,
    }
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700 && links[0]) {
        navigate(links[0]); // Add a fallback route if `sidepanel[0]` is not available
      }
    };

    // Check initially in case the width is already > 700
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate, links]);

  useEffect(() => {
    if (staffvalidation?.status === "Failed") {
      toast({
        variant: "destructive",
        description: staffvalidation.notes || "An error occurred.",
      });
      setIsChecking(false); // Stop checking if status is "Failed"
    } else if (staffvalidation?.user_id === userId) {
      toast({
        variant: "success",
        description: "Checked-In Successfully",
      });
      setIsChecking(false);
    } else if (isChecking) {
      const interval = setInterval(() => {
        refetch();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [staffvalidation, isChecking, refetch, userId]);

  console.log("qrcode-code", token);
  useDocumentTitle("QR Code")
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-lg font-bold mb-4">Scan the QR Code</h2>
      <QRCodeSVG
        value={token ?? ""}
        size={256}
        imageSettings={{
          src: logomainsvg,
          x: undefined,
          y: undefined,
          height: 48,
          width: 48,
          opacity: 1,
          excavate: true,
        }}
      />
      <p className="mt-4 text-center text-gray-600">
        Use this QR code for secure access.
      </p>
    </div>
  );
};

export default QRCodePage;
