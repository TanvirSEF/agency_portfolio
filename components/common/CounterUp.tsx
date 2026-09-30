"use client";

import CountUp from "@/components/ui/count-up";
import GradientText from "@/components/ui/gradient-text";
import { RichTextInline, richTextToPlainText } from "./RichTextContent";

interface CounterStat {
  value: string | number;
  label: string;
}

interface CounterUpProps {
  stats: CounterStat[];
  color?: string;
  className?: string;
  /** Gradient colors for value and label text. Defaults to a purple/pink gradient. */
  gradientColors?: string[];
}

/** Parse stat value into numeric part and suffix (e.g. "250+" -> { num: 250, suffix: "+" }). */
function parseStatValue(value: string | number): { num: number; suffix: string } | null {
  const str = String(value).trim();
  const match = str.match(/^([\d.,]+)(.*)$/);
  if (!match) return null;
  const num = parseFloat(match[1].replace(/,/g, ""));
  if (Number.isNaN(num)) return null;
  return { num, suffix: match[2] ?? "" };
}

export default function CounterUp({
  stats,
  color = "#ffffff",
  className,
  gradientColors = [color, "#0474C4", "#A8C4EC"],
}: CounterUpProps) {
  return (
    <div className={`mx-auto grid grid-cols-3 gap-6 sm:gap-x-16 sm:gap-y-8 lg:grid-cols-6 sm:*:gap-4 ${className ?? ""}`}>
      {stats.map((stat, index) => {
        const parsed = parseStatValue(stat.value);
        const valueContent =
          parsed !== null ? (
            <CountUp
              to={parsed.num}
              from={0}
              duration={2}
              delay={0.2}
              className="inline-block"
              suffix={parsed.suffix}
            />
          ) : (
            stat.value
          );

        return (
          <div key={`${richTextToPlainText(stat.label) || index}-${index}`} className="flex flex-col items-center">
            <GradientText
              className="text-[1.8rem] px-4 font-bold sm:text-5xl"
              colors={gradientColors}
              animationSpeed={10}
              yoyo={true}
              showBorder={false}
            >
              {valueContent}
            </GradientText>
            <GradientText
              className="text-center px-2 lg:text-[1.2rem]"
              colors={gradientColors}
              animationSpeed={10}
              yoyo={true}
              showBorder={false}
            >
              <RichTextInline content={stat.label} />
            </GradientText>
          </div>
        );
      })}
    </div>
  );
}
