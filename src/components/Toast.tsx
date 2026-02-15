import React from "react";

type toastProps = {
  message: string;
  isSuccess: boolean | undefined;
  withLoginButton?: boolean;
  duration?: number;
  onClose: () => void;
};

const Toast = ({
  message,
  isSuccess,
  withLoginButton,
}: toastProps): React.ReactElement => {

  return (
    <>
      <div
        className={`w-full flex justify-center gap-2.5 text-center z-1000 border-2 
        ${isSuccess === true
            ? "bg-[#EAFCEF] border-success text-success" // success
            : isSuccess === false
              ? "bg-[#FFDDCA] border-danger text-danger" // fail
              : "bg-[#F3F4F6] border-[#9CA3AF] text-[#374151]" // pending
          } px-3.75 py-1.25 rounded-lg text-[18px] font-semibold transition capitalize`}
      >
        <p>
          {message}{" "}
          {withLoginButton && (
            <a
              href="/login"
              className={`px-0.5 border-b-2
              ${isSuccess === true
                  ? "bg-[#EAFCEF] border-success text-success" // success
                  : isSuccess === false
                    ? "bg-[#FFDDCA] border-danger text-danger" // fail
                    : "bg-[#F3F4F6] border-[#9CA3AF] text-[#374151]" // pending
                } h-6.25`}
            >
              login here
            </a>
          )}
        </p>
      </div>
    </>
  );
};

export default Toast;