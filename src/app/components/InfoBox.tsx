// src/app/components/InfoBox.tsx
import { LucideIcon } from "lucide-react";

interface InfoBoxProps {
  icon?: LucideIcon;
  iconImage?: string;
  title: string;
  description: string;
  iconSize?: string;
  iconOffset?: string;
  textOffset?: string;

  // per-card overrides
  titleClassName?: string;
  descriptionClassName?: string;
}

export function InfoBox({
  icon: Icon,
  iconImage,
  title,
  description,
  iconSize = "w-8 h-8",
  iconOffset = "",
  textOffset = "",
  titleClassName = "",
  descriptionClassName = "",
}: InfoBoxProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 flex flex-col items-center text-center hover:scale-[1.03] transition-transform duration-150 w-[65%] sm:w-full mx-auto sm:mx-0">
      {iconImage ? (
        <img
          src={iconImage}
          alt=""
          className={`${iconSize} mb-3 ${iconOffset}`}
          style={{
            filter:
              "brightness(0) saturate(100%) invert(84%) sepia(13%) saturate(659%) hue-rotate(122deg) brightness(95%) contrast(86%)",
          }}
        />
      ) : Icon ? (
        <Icon className={`${iconSize} text-[#b2dbd7] mb-3`} />
      ) : null}

      <h3 className={`text-white mb-2 ${textOffset} ${titleClassName}`}>
        {title}
      </h3>

      <p
        className={`text-gray-300 text-sm ${textOffset} ${descriptionClassName}`}
      >
        {description}
      </p>
    </div>
  );
}
