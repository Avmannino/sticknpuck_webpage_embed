// src/app/components/PriceCard.tsx
type PriceCardProps = {
  title: string;

  /**
   * If you want the big price line (like "$20"), pass price.
   * If you want a "list-only" card (no big price line), omit price and set showPrice={false}.
   */
  price?: string;

  description?: string;
  features?: string[];
  className?: string;

  /** Defaults to true. Set false to hide the big price line entirely. */
  showPrice?: boolean;
};

export function PriceCard({
  title,
  price,
  description,
  features = [],
  className = "",
  showPrice = true,
}: PriceCardProps) {
  const isAdmission = title.trim().toLowerCase() === "admission";
  const isSkateRental = title.trim().toLowerCase() === "skate rental";

  const shouldShowPrice = showPrice && typeof price === "string" && price.trim().length > 0;

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 p-6 h-full ${className}`}>
      <div className="flex flex-col items-start text-left h-full">
        <div
          className={[
            "w-full",
            "max-[600px]:text-center",
            "min-[601px]:max-[1000px]:text-center",
            isAdmission ? "-mt-[1px]" : "",
          ].join(" ")}
        >
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

          {/* ✅ Price block is now optional */}
          {shouldShowPrice ? (
            <div className="mt-3">
              <div className="text-white text-4xl sm:text-4xl font-bold leading-none">
                {price}
              </div>
              {description ? (
                <div className="text-gray-300 text-sm mt-2">{description}</div>
              ) : null}
            </div>
          ) : (
            // ✅ If we’re not showing the price line, keep spacing consistent
            description ? (
              <div className="mt-3 text-gray-300 text-sm">{description}</div>
            ) : (
              <div className="mt-3" />
            )
          )}
        </div>

        {features.length > 0 ? (
          <ul
            className={[
              // If there's no big price line, bring the list up a touch
              shouldShowPrice ? "mt-6" : "mt-4",
              "space-y-3 text-gray-200 text-sm list-disc list-inside",
              "min-[601px]:max-[1000px]:text-center",
              "min-[601px]:max-[1000px]:list-inside",
              "max-[600px]:text-center",
              "max-[600px]:list-inside",
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
