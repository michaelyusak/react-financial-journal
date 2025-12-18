import React from "react";
import { Outlet } from "react-router-dom";
import { smoke } from "../assets";

const AuthenticationTemplate = (): React.ReactElement => {
  return (
    <>
      <section
        className={`w-screen h-screen relative flex justify-center items-center overflow-hidden`}
      >
        <video
          src={smoke}
          className="absolute z-[-5] top-0 right-0 w-screen h-screen object-cover"
          autoPlay
          muted
          loop
        ></video>

        <div
          className="absolute inset-0 w-full h-full bg-[#A5A79D] z-0 mix-blend-multiply"
        ></div>

        <Outlet></Outlet>
      </section>
    </>
  );
};

export default AuthenticationTemplate;
