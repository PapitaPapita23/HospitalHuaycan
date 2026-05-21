import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

type LoginInputProps = {
  type: string;
  placeholder?: string;
  showToggle?: boolean;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
  autoFocus?: boolean;
  autoComplete?: string;
};

const LoginInput: React.FC<LoginInputProps> = ({
  type,
  placeholder,
  showToggle,
  id,
  value,
  onChange,
  onBlur,
  ariaInvalid,
  ariaDescribedby,
  autoFocus,
  autoComplete,
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType =
    showToggle && isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="relative">
      <input
        type={inputType}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...(ariaInvalid && { "aria-invalid": "true" })}
        aria-describedby={ariaDescribedby}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        className="w-full px-1 py-2 bg-transparent border-b border-[#333333] text-[#0A1733] focus:outline-none focus:border-[#0A1733]"
      />
      {showToggle && isPassword && (
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-[#333333]"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? (
            // SVG de ojo abierto
            <FaRegEye className="w-5 h-5" />
          ) : (
            // SVG de ojo cerrado
            <FaRegEyeSlash className="w-5 h-5" />
          )}
        </span>
      )}
    </div>
  );
};

export default LoginInput;
