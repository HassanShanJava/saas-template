import IMAGES from "@/assets/IMAGES";
import "./landing-page.css";
import { useNavigate } from "react-router-dom";
import CommonButton from "@/components/custom-component/CommonButton";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="LandingPage-main flex h-screen items-center px-4 sm:px-8 md:px-12 lg:px-16">
      <div className="flex w-full max-w-lg flex-col items-start justify-center p-4 md:max-w-xl lg:max-w-2xl lg:pl-14">
        <div className="mb-4 h-20 w-full">
          <img
            src={IMAGES?.dashboard_logo}
            alt="Logo"
            className="mx-auto h-full w-auto object-contain sm:mx-0"
          />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="mt-2 text-lg font-bold text-white sm:text-xl lg:text-2xl">
            CONNECTING PEOPLE TO SERVICES
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white sm:text-base lg:text-lg">
            We help our clients create truly excellent customer and employee
            experiences as well as smoother, more efficient operations – every
            day and all around the world.
          </p>
          <div className="mt-2">
            {/* <ShadButton
              title="Login"
              onClick={() => navigation('/login')}
              className="mt-4 w-[10rem] bg-gradient-to-t from-[#E14746] to-[#C53643]"
            /> */}
            <CommonButton title="Login" onClick={() => navigate("/login")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
