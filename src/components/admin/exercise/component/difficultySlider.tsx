import React from 'react';
import * as Slider from '@radix-ui/react-slider';
// DifficultyEnum.ts
export enum Difficulty {
    Novice = 0,
    Beginner,
    Intermediate,
    Advance,
    Expert,
  }
  
  export const difficultyTypeOptions = [
    { value: Difficulty.Novice, label: "Novice" },
    { value: Difficulty.Beginner, label: "Beginner" },
    { value: Difficulty.Intermediate, label: "Intermediate" },
    { value: Difficulty.Advance, label: "Advance" },
    { value: Difficulty.Expert, label: "Expert" },
  ];
  
//   interface DifficultySliderProps {
//     id: string;
//     value: Difficulty;
//     onChange: (value: Difficulty) => void;
//     error?: string;
//   }
  
//   const DifficultySlider: React.FC<DifficultySliderProps> = ({ id, value, onChange, error }) => {
//     return (
//       <div className="relative">
//         <label htmlFor={id} className="block text-sm font-medium">
//           Difficulty:
//         </label>
//         <div className="relative w-full max-w-lg mt-1">
//           <Slider.Root
//             className="relative flex items-center select-none touch-none h-4"
//             min={0}
//             max={difficultyTypeOptions.length - 1}
//             step={1}
//             value={[value]} // Set value as an array
//             onValueChange={(val) => onChange(val[0] as Difficulty)} // Extract first item and cast to Difficulty
//           >
//             <Slider.Track className="relative flex-grow h-2 bg-gray-200 rounded-full">
//               <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
//               <div className="absolute inset-0 flex items-center justify-between">
//                 {difficultyTypeOptions.map((option) => (
//                   <div
//                     key={option.value}
//                     className={`w-3 h-3 rounded-full ${option.value === value ? '' : 'bg-gray-400'}`}
//                     style={{ left: `${(option.value / (difficultyTypeOptions.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
//                   />
//                 ))}
//               </div>
//             </Slider.Track>
//             <Slider.Thumb className="block w-5 h-5 bg-green-600 ring-primary ring-2 rounded-full border-2 border-white shadow-md focus:outline-none" />
//           </Slider.Root>
  
//           <div className="mt-2 flex justify-between text-xs">
//             {difficultyTypeOptions.map((option) => (
//               <span
//                 key={option.value}
//                 className={option.value === value ? 'font-semibold text-green-600' : 'text-gray-400'}
//               >
//                 {option.label}
//               </span>
//             ))}
//           </div>
  
//           {error && (
//             <span className="text-red-500 mt-[5px] text-xs">
//               {error}
//             </span>
//           )}
//         </div>
//       </div>
//     );
//   };
  
//   export default DifficultySlider;
  


interface DifficultySliderProps {
  id: string;
  value: Difficulty;
  onChange: (value: Difficulty) => void;
  error?: string;
}

const DifficultySlider: React.FC<DifficultySliderProps> = ({ id, value, onChange, error }) => {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium">
        Difficulty:
      </label>
      <div className="relative w-full max-w-lg mt-1">
        <Slider.Root
          className="relative flex items-center select-none touch-none h-4"
          min={0}
          max={difficultyTypeOptions.length - 1}
          step={1}
          value={[difficultyTypeOptions.findIndex(option => option.value === value)]} // Map Difficulty to index
          onValueChange={(val) => onChange(difficultyTypeOptions[val[0]].value as Difficulty)} // Map index back to Difficulty
        >
          <Slider.Track className="relative flex-grow h-2 bg-gray-200 rounded-full">
            <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
            <div className="absolute inset-0 flex items-center justify-between">
              {difficultyTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`w-3 h-3 rounded-full ${option.value === value ? '' : 'bg-gray-400'}`}
                  style={{ left: `${(difficultyTypeOptions.findIndex(o => o.value === option.value) / (difficultyTypeOptions.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
                />
              ))}
            </div>
          </Slider.Track>
          <Slider.Thumb className="block w-5 h-5 bg-green-600 ring-primary ring-2 rounded-full border-2 border-white shadow-md focus:outline-none" />
        </Slider.Root>

        <div className="mt-2 flex justify-between text-xs">
          {difficultyTypeOptions.map((option) => (
            <span
              key={option.value}
              className={option.value === value ? 'font-semibold text-green-600' : 'text-gray-400'}
            >
              {option.label}
            </span>
          ))}
        </div>

        {error && (
          <span className="text-red-500 mt-[5px] text-xs">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default DifficultySlider;
