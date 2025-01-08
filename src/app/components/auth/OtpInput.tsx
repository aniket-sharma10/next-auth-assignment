import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

type OtpInputProps = {
  length?: number; // Number of OTP digits
  onOtpSubmit?: (otp: string) => void; // Function that receives the OTP
};

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onOtpSubmit }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length && onOtpSubmit) {
      onOtpSubmit(combinedOtp); // Trigger OTP submission
    }

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-2">
      {otp.map((value, index) => (
        <Input
          key={index}
          value={value}
          maxLength={1}
          ref={(input) => {
            if (input) inputRefs.current[index] = input;
          }}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 text-center text-lg"
        />
      ))}
    </div>
  );
};

export default OtpInput;
