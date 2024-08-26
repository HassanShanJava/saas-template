import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import logomainsvg from "@/assets/logo-main.svg";
const ExpiredLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="loginpage-image">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-5 mx-16 justify-between items-center h-dvh ">
          <div className=" col-span-3"></div>
          <Card className="col-span-2 mx-auto bg-transparent bg-opacity-10  backdrop-blur-sm custom-gradient-bg rounded-3xl border-checkboxborder shadow-lg p-2">
            <CardHeader>
              <CardTitle>
                <div className="gap-1 flex justify-center items-center">
                  <div>
                    <img
                      src={logomainsvg}
                      height={110}
                      width={100}
                      alt="Main logo"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-textwhite leading-5 italic font-semibold text-[1.43rem]">
                      Reset Your Password.
                    </p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="text-white text-[1.2rem]">
                  <p>
                    The reset link is invalid or expired. Please request a new
                    link from the{" "}
                    <span
                      onClick={() => navigate("/forgot_password")}
                      className="cursor-pointer underline font-semibold text-textprimary"
                    >
                      forgot password
                    </span>{" "}
                    page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpiredLogin;
