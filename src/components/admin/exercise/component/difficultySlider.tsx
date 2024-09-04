import React from "react";
import * as Slider from "@radix-ui/react-slider";
interface DifficultySliderProps {
  id: string;
  value: Difficulty;
  onChange: (value: Difficulty) => void;
  error?: string;
}

const difficultyLabels = [
  "Novice",
  "Beginner",
  "Intermediate",
  "Advance",
  "Expert",
];

export enum Difficulty {
  Novice = 0,
  Beginner,
  Intermediate,
  Advance,
  Expert,
}

const DifficultySlider: React.FC<DifficultySliderProps> = ({
  id,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-sm font-medium">
          Difficulty*:
        </label>
        <span className="text-sm font-medium text-green-600">
          {difficultyLabels[value]}
        </span>
      </div>
      <div className="relative w-full max-w-lg mt-1">
        <Slider.Root
          className="relative flex items-center select-none touch-none h-4"
          min={Difficulty.Novice}
          max={Difficulty.Expert}
          step={1}
          value={[value]}
          onValueChange={(val) => onChange(val[0] as Difficulty)}
        >
          <Slider.Track className="relative flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
            <Slider.Range className="absolute h-full rounded-full" />
            <div className="absolute inset-0 flex items-center justify-between w-full px-1">
              {" "}
              {difficultyLabels.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === value ? "bg-green-600" : "bg-gray-400"
                  }`}
                  style={{
                    position: "absolute",
                    left: `${(index / (difficultyLabels.length - 1)) * 100}%`,
                    transform: "translateX(-50%)", // Ensures the dot is centered
                  }}
                />
              ))}
            </div>
          </Slider.Track>

          <Slider.Thumb className="block w-5 h-5 cursor-grab bg-green-600 ring-primary ring-2 rounded-full border-2 border-white shadow-md focus:outline-none" />
        </Slider.Root>

        {error && (
          <span className="text-red-500 mt-[5px] text-xs">{error}</span>
        )}
      </div>
    </div>
  );
};

export default DifficultySlider;
