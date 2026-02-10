type PriceCardProps = {
  title: string;
  price: string;
  description?: string;
  features?: string[];
  className?: string;
};

export function PriceCard({
  title,
  price,
  description,
  features = [],
  className = "",
}: PriceCardProps) {
  const isAdmission = title.trim().toLowerCase() === "admission";
  const isSkateRental = title.trim().toLowerCase() === "skate rental";

  return (
    <div
      className={`bg-gray-800 rounded-lg border border-gray-700 p-6 h-full ${className}`}
    >
      {/* Default: desktop (>=1001px) left-aligned */}
      <div className="flex flex-col items-start text-left h-full">
        {/* ✅ Nudge ONLY the Admission "top block" up slightly so it matches Skate Rental */}
        <div
          className={[
            "w-full",
            "max-[600px]:text-center",
            "min-[601px]:max-[1000px]:text-center",
            isAdmission ? "-mt-[1px]" : "",
          ].join(" ")}
        >
          {/* ✅ Lower ONLY "Skate Rental" title font size */}
          <h3
            className={[
              "text-white font-semibold",
              isSkateRental
                ? "text-lg sm:text-xl max-[450px]:text-[17px]"
                : "text-xl sm:text-2xl max-[450px]:text-[17.5px]",
            ].join(" ")}
          >
            {title}
          </h3>

          <div className="mt-3">
            <div className="text-white text-4xl sm:text-4xl font-bold leading-none">
              {price}
            </div>
            {description ? (
              <div className="text-gray-300 text-sm mt-2">{description}</div>
            ) : null}
          </div>
        </div>

        {features.length > 0 ? (
          <ul
            className={[
              "mt-6 space-y-3 text-gray-200 text-sm list-disc list-inside",
              "min-[601px]:max-[1000px]:text-center",
              "min-[601px]:max-[1000px]:list-inside",
            ].join(" ")}
          >
            {features.map((feature, idx) => (
              <li key={idx} className="leading-relaxed">
                {feature}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto" />
      </div>
    </div>
  );
}
