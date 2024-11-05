import React, { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { extractLinks } from "@/utils/helper";

import { useGetValidateUserQuery } from "@/services/userApi";
import { toast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
const QRCodePage: React.FC = () => {
  const userToken = localStorage.getItem("userToken");
  const sidepanel = localStorage.getItem("sidepanel");
  const decodedSidepanel = JSON.parse(atob(sidepanel as string));
  const links = extractLinks(decodedSidepanel);
  const navigate = useNavigate();
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
  } = useGetValidateUserQuery({
    user_id: userId as number,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) {
        navigate(links[0]); // Add a fallback route if `sidepanel[0]` is not available
      }
    };

    // Check initially in case the width is already > 700
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate, sidepanel]);

  useEffect(() => {
    if (staffvalidation?.status === "successful") {
      toast({
        variant: "success",
        description: "Checked-In Successfully",
      });
      setIsChecking(false); // Stop polling
    } else if (isChecking) {
      const interval = setInterval(() => {
        refetch(); // Poll the API every few seconds
      }, 5000); // Polling interval in milliseconds

      return () => clearInterval(interval); // Clear interval on unmount
    }
  }, [staffvalidation, isChecking, refetch]);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-lg font-bold mb-4">Scan the QR Code</h2>
      <QRCodeSVG value={userToken ?? ""} size={256} />
      <p className="mt-4 text-center text-gray-600">
        Use this QR code for secure access.
      </p>
    </div>
  );
};

export default QRCodePage;
