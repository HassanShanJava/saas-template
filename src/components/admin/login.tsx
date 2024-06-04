import "./style.css";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {faEnvelope,faEye} from "@fortawesome/free-regular-svg-icons"
import { faLock } from "@fortawesome/free-solid-svg-icons";
export default function AuthenticationPage(){
    return (
      <div className="flex mx-16 justify-between items-center h-dvh p-">
        <div className=" flex flex-col gap-2">
          <div>
            <span className="bg-white  p-2 rounded-lg">
              <span className="hero-topHeading text-2xl text-[#E44516]">
                GIVE YOUR
              </span>
            </span>
          </div>
          <div>
            <h2 className="hero-topHeading text-white text-4xl">
              MUSCLE MORE <br /> STRENGTH
            </h2>
          </div>
        </div>
        <div>
          <Card className="mx-auto max-w-sm bg-[#FFFFFF] p-6 rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle>
                <div className="gap-2 flex justify-center items-center">
                  <div>
                    <img src="logo.svg" height={50} width={50}></img>
                  </div>
                  <div>
                    <h1 className="hero-topHeading text-[1.7rem] text-[#E44516]">
                      Let's Move
                    </h1>
                    <p className="tracking-[0.30rem]  italic font-semibold text-[0.95rem]">
                      {" "}
                      Track Your Fitness
                    </p>
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 ">
                <h2 className="flex  text-[#E44516] justify-center items-center font-bold text-[1.1rem]">
                  Log In
                </h2>
                <p className="mt-2 font-semibold text-center text-[15px] ">
                  Ready to discover some amazing <br /> opportunities
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                {" "}
                <div className="flex items-center w-full gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    color="gray"
                    className="pr-2"
                  />
                  <input
                    id="username"
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                <div className="flex items-center w-full gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400">
                  <FontAwesomeIcon
                    icon={faLock}
                    color="gray"
                    className="pr-2"
                  />
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="w-full bg-transparent outline-none"
                  />
                  <FontAwesomeIcon icon={faEye} color="gray" className="pr-2" />
                </div>
                <div className="flex justify-end p-0 m-0">
                  <span className="text-[11px] font-semibold text-[#E44516]">
                    Forget Password?
                  </span>
                </div>
                <Button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 bg-[#D0FD3E] text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500"
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
}