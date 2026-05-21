import React from "react";

type LoginButtonProps = {
  children: React.ReactNode;
};

const LoginButton: React.FC<LoginButtonProps> = ({ children }) => {
  return (
    <button
      className="flex w-full px-5 py-2 justify-center items-center gap-[10px] flex-shrink-0 rounded-[30px] bg-[#FF0000] text-white font-semibold text-[14px] 2xl:text-[15px] transition-colors hover:bg-[#D90000] shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
    >
      {children}
    </button>
  );
};

export default LoginButton; 