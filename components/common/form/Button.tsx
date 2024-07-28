import { FC, ReactNode, ReactElement } from "react";
import { Button } from "@material-tailwind/react";
import SyncLoader from "react-spinners/PulseLoader";
import Link from "next/link";

interface IButtonProps {
  isLoading?: boolean;
  children?: ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
  color?: string;
  icon?: ReactElement;
  border?: string;
  to?: string;
  type?: "reset" | "submit" | "button";
  size?: "sm" | "lg";
  variant?: "outlined" | "filled" | "gradient" | "text";
}

const CustomButton: FC<IButtonProps> = (props) => {
  const {
    isLoading,
    children,
    label,
    className,
    onClick,
    color,
    icon,
    border,
    to,
    type,
    variant,
  } = props;

  let colorClass = "hover:bg-primary focus:ring-blue bg-primary text-white";
  if (color) colorClass = color;
  else if (variant == "outlined")
    colorClass =
      "hover:bg-primary hover:text-white focus:ring-primary bg-transparent text-primary";

  return (
    <>
      {to ? (
        <Link
          href={to}
          onClick={() => {
            onClick && onClick();
          }}
        >
          <Button
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            className={`flex justify-center  items-center gap-2 rounded-lg font-inherit border ${
              border ?? "border-transparent"
            } ${colorClass} py-2 px-5 text-sm font-medium shadow-sm focus:ring-2 focus:outline-none outline-none transition-colors duration-300 ${className}`}
          >
            {isLoading ? (
              <SyncLoader size={8} color="currentColor" />
            ) : (
              <>
                {icon && <div>{icon}</div>}
                <div className="flex">{children ? children : label}</div>
              </>
            )}
          </Button>
        </Link>
      ) : (
        <Button
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          type={type ?? "button"}
          disabled={isLoading}
          onClick={() => {
            onClick && onClick();
          }}
          className={`flex gap-2 items-center justify-center rounded-lg border font-inherit ${
            border ?? "border-transparent"
          } py-2 px-5 text-sm font-medium shadow-sm focus:ring-2 ${colorClass} focus:outline-none outline-none transition-colors duration-300 ${className}`}
        >
          {isLoading ? (
            <SyncLoader size={8} color="currentColor" />
          ) : (
            <>
              {icon && <div>{icon}</div>}
              <div className="flex items-center gap-3">
                {children ? children : label}
              </div>
            </>
          )}
        </Button>
      )}
    </>
  );
};

export default CustomButton;
