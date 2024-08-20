// import { Button } from "@/components/ui/button";
// import React from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";

// interface FormValues {
//   mode: "time-based" | "repetition-based";
//   timePerSet: { value: number | null }[];
//   restPerSet: { value: number | null }[];
//   repetitionPerSet: { value: number | null }[];
// }

// const MyForm: React.FC = () => {
//   const {
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     register,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: {
//       mode: "time-based",
//       timePerSet: [{ value: null }],
//       restPerSet: [{ value: null }],
//       repetitionPerSet: [{ value: null }],
//     },
//   });

//   const {
//     fields: timeFields,
//     append: appendTime,
//     remove: removeTime,
//   } = useFieldArray({
//     control,
//     name: "timePerSet",
//   });

//   const {
//     fields: restFields,
//     append: appendRest,
//     remove: removeRest,
//   } = useFieldArray({
//     control,
//     name: "restPerSet",
//   });

//   const {
//     fields: repetitionFields,
//     append: appendRepetition,
//     remove: removeRepetition,
//   } = useFieldArray({
//     control,
//     name: "repetitionPerSet",
//   });

//   const mode = watch("mode");

//   React.useEffect(() => {
//     if (mode === "time-based") {
//       setValue("timePerSet", [{ value: null }]);
//       setValue("restPerSet", [{ value: null }]);
//       setValue("repetitionPerSet", []);
//     } else {
//       setValue("repetitionPerSet", [{ value: null }]);
//       setValue("restPerSet", [{ value: null }]);
//       setValue("timePerSet", []);
//     }
//   }, [mode, setValue]);

//   const onSubmit = (data: FormValues) => {
//     console.log(data);
//     const timePerSetValues = data.timePerSet.map((item) => Number(item.value));
//     const restPerSetValues = data.restPerSet.map((item) => Number(item.value));
//     const repetitionPerSetValues = data.repetitionPerSet.map((item) =>
//       Number(item.value)
//     );

//     console.log("Time Per Set:", timePerSetValues);
//     console.log("Rest Per Set:", restPerSetValues);
//     console.log("Repetition Per Set:", repetitionPerSetValues);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="p-6 bg-gray-100 rounded-lg max-w-md mx-auto"
//     >
//       <div className="mb-4">
//         <label className="mr-4">
//           <input
//             type="radio"
//             value="time-based"
//             {...register("mode")}
//             className="mr-2"
//           />
//           Time-Based
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="repetition-based"
//             {...register("mode")}
//             className="mr-2"
//           />
//           Repetition-Based
//         </label>
//       </div>

//       {/* {mode === "time-based" && (
//         <div className="mb-6">
//           {timeFields.map((field, index) => (
//             <div key={field.id} className="mb-4 gap-4 flex flex-col">
//               <div className="flex items-center mb-1 gap-2 ">
//                 <Controller
//                   name={`timePerSet.${index}.value` as const}
//                   control={control}
//                   rules={{
//                     required: "Required",
//                     min: { value: 0, message: "Required" },
//                   }}
//                   render={({ field }) => (
//                     <div>
//                       <input
//                         type="number"
//                         {...field}
//                         className={`border p-2 rounded w-24 mr-4 ${
//                           errors?.timePerSet?.[index] ? "border-red-500" : ""
//                         }`}
//                         min="0"
//                         placeholder="Time"
//                         value={field.value ?? ""}
//                       />
//                       {errors?.timePerSet?.[index] && (
//                         <span className="text-red-500 text-sm">
//                           {errors.timePerSet[index]?.value?.message}
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 />
//                 <Controller
//                   name={`restPerSet.${index}.value` as const}
//                   control={control}
//                   rules={{
//                     required: "Required",
//                     min: { value: 0, message: "Required" },
//                   }}
//                   render={({ field }) => (
//                     <div>
//                       <input
//                         type="number"
//                         {...field}
//                         className={`border p-2 rounded w-24 mr-4 ${
//                           errors?.restPerSet?.[index] ? "border-red-500" : ""
//                         }`}
//                         placeholder="Rest"
//                         min="0"
//                         value={field.value ?? ""}
//                       />
//                       {errors?.restPerSet?.[index] && (
//                         <span className="text-red-500 text-sm">
//                           {errors.restPerSet[index]?.value?.message}
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 />
//                 <div className="flex justify-center items-center gap-2">
//                   <Button
//                     type="button"
//                     variant={"ghost"}
//                     onClick={() => {
//                       appendTime({ value: null });
//                       appendRest({ value: null });
//                     }}
//                     className="text-primary px-4 gap-2 py-2 rounded hover:bg-primary"
//                   >
//                     Add <i className="fa-solid fa-plus"></i>
//                   </Button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       if (timeFields.length > 1) {
//                         removeTime(index);
//                         removeRest(index);
//                       }
//                     }}
//                     className="text-red-500 hover:text-red-700"
//                     disabled={timeFields.length <= 1} // Disable button if only one pair remains
//                   >
//                     <i className="fa-solid fa-trash"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {mode === "repetition-based" && (
//         <div className="mb-6 ">
//           {repetitionFields.map((field, index) => (
//             <div key={field.id} className="mb-4 flex items-center gap-2">
//               <Controller
//                 name={`repetitionPerSet.${index}.value` as const}
//                 control={control}
//                 rules={{
//                   required: "Required",
//                   min: { value: 0, message: "Required" },
//                 }}
//                 render={({ field }) => (
//                   <div>
//                     <input
//                       type="number"
//                       {...field}
//                       className={`border p-2 rounded w-24 mr-4 ${
//                         errors?.repetitionPerSet?.[index]
//                           ? "border-red-500"
//                           : ""
//                       }`}
//                       min="0"
//                       placeholder="Reps"
//                       value={field.value ?? ""}
//                     />
//                     {errors?.repetitionPerSet?.[index] && (
//                       <span className="text-red-500 text-sm">
//                         {errors.repetitionPerSet[index]?.value?.message}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               />
//               <Controller
//                 name={`restPerSet.${index}.value` as const}
//                 control={control}
//                 rules={{
//                   required: "Required",
//                   min: { value: 0, message: "Required" },
//                 }}
//                 render={({ field }) => (
//                   <div>
//                     <input
//                       type="number"
//                       {...field}
//                       className={`border p-2 rounded w-24 mr-4 ${
//                         errors?.restPerSet?.[index] ? "border-red-500" : ""
//                       }`}
//                       min="0"
//                       placeholder="Rest"
//                       value={field.value ?? ""}
//                     />
//                     {errors?.restPerSet?.[index] && (
//                       <span className="text-red-500 text-sm">
//                         {errors.restPerSet[index]?.value?.message}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               />
//               <Button
//                 type="button"
//                 variant={"ghost"}
//                 onClick={() => {
//                   appendRepetition({ value: null });
//                   appendRest({ value: null });
//                 }}
//                 className=" gap-2 text-primary px-4 py-2 rounded hover:bg-primary"
//               >
//                 Add <i className="fa-solid fa-plus"></i>
//               </Button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (repetitionFields.length > 1) {
//                     removeRepetition(index);
//                     removeRest(index);
//                   }
//                 }}
//                 className="text-red-500 hover:text-red-700"
//                 disabled={repetitionFields.length <= 1} // Disable button if only one pair remains
//               >
//                 <i className="fa-solid fa-trash"></i>
//               </button>
//             </div>
//           ))}
//         </div>
//       )} */}

//       {mode === "time-based" && (
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Time & Rest Per Set</h3>
//           {timeFields.map((field, index) => (
//             <div key={field.id} className="mb-4 flex items-center">
//               <Controller
//                 name={`timePerSet.${index}.value` as const}
//                 control={control}
//                 rules={{ required: "Required" }}
//                 render={({ field }) => (
//                   <input
//                     type="number"
//                     {...field}
//                     className={`border p-2 rounded w-24 mr-4 ${
//                       errors?.timePerSet?.[index] ? "border-red-500" : ""
//                     }`}
//                     min="0"
//                     placeholder="Time"
//                     value={field.value ?? ""}
//                   />
//                 )}
//               />
//               {errors?.timePerSet?.[index] && (
//                 <span className="text-red-500 mr-4">
//                   {errors.timePerSet[index]?.value?.message}
//                 </span>
//               )}
//               <Controller
//                 name={`restPerSet.${index}.value` as const}
//                 control={control}
//                 rules={{ required: "Required" }}
//                 render={({ field }) => (
//                   <input
//                     type="number"
//                     {...field}
//                     className={`border p-2 rounded w-24 mr-4 ${
//                       errors?.restPerSet?.[index] ? "border-red-500" : ""
//                     }`}
//                     placeholder="Rest"
//                     min="0"
//                     value={field.value ?? ""}
//                   />
//                 )}
//               />
//               {errors?.restPerSet?.[index] && (
//                 <span className="text-red-500 mr-4">
//                   {errors.restPerSet[index]?.value?.message}
//                 </span>
//               )}
//               {index > 0 && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     removeTime(index);
//                     removeRest(index);
//                   }}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => {
//               appendTime({ value: null });
//               appendRest({ value: null });
//             }}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Add More Time & Rest
//           </button>
//         </div>
//       )}

//       {mode === "repetition-based" && (
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">
//             Repetition & Rest Per Set
//           </h3>
//           {repetitionFields.map((field, index) => (
//             <div key={field.id} className="mb-4 flex items-center">
//               <Controller
//                 name={`repetitionPerSet.${index}.value` as const}
//                 control={control}
//                 rules={{ required: "Required" }}
//                 render={({ field }) => (
//                   <input
//                     type="number"
//                     {...field}
//                     className={`border p-2 rounded w-24 mr-4 ${
//                       errors?.repetitionPerSet?.[index] ? "border-red-500" : ""
//                     }`}
//                     min="0"
//                     value={field.value ?? ""}
//                     placeholder="Reps"
//                   />
//                 )}
//               />
//               {errors?.repetitionPerSet?.[index] && (
//                 <span className="text-red-500 mr-4">
//                   {errors.repetitionPerSet[index]?.value?.message}
//                 </span>
//               )}
//               <Controller
//                 name={`restPerSet.${index}.value` as const}
//                 control={control}
//                 rules={{ required: "Required" }}
//                 render={({ field }) => (
//                   <input
//                     type="number"
//                     {...field}
//                     className={`border p-2 rounded w-24 mr-4 ${
//                       errors?.restPerSet?.[index] ? "border-red-500" : ""
//                     }`}
//                     min="0"
//                     placeholder="Rest"
//                     value={field.value ?? ""}
//                   />
//                 )}
//               />
//               {errors?.restPerSet?.[index] && (
//                 <span className="text-red-500 mr-4">
//                   {errors.restPerSet[index]?.value?.message}
//                 </span>
//               )}
//               {index > 0 && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     removeRepetition(index);
//                     removeRest(index);
//                   }}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => {
//               appendRepetition({ value: null });
//               appendRest({ value: null });
//             }}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Add More Reps & Rest
//           </button>
//         </div>
//       )}
//       <button
//         type="submit"
//         className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 w-full"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default MyForm;

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

interface FormValues {
  mode: "time-based" | "repetition-based";
  timePerSet: { value: number | null }[];
  restPerSet: { value: number | null }[];
  repetitionPerSet: { value: number | null }[];
}

const MyForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      mode: "time-based",
      timePerSet: [{ value: null }],
      restPerSet: [{ value: null }],
      repetitionPerSet: [{ value: null }],
    },
  });

  const {
    fields: timeFields,
    append: appendTime,
    remove: removeTime,
  } = useFieldArray({
    control,
    name: "timePerSet",
  });

  const {
    fields: restFields,
    append: appendRest,
    remove: removeRest,
  } = useFieldArray({
    control,
    name: "restPerSet",
  });

  const {
    fields: repetitionFields,
    append: appendRepetition,
    remove: removeRepetition,
  } = useFieldArray({
    control,
    name: "repetitionPerSet",
  });

  const mode = watch("mode");

  React.useEffect(() => {
    if (mode === "time-based") {
      setValue("timePerSet", [{ value: null }]);
      setValue("restPerSet", [{ value: null }]);
      setValue("repetitionPerSet", []);
    } else {
      setValue("repetitionPerSet", [{ value: null }]);
      setValue("restPerSet", [{ value: null }]);
      setValue("timePerSet", []);
    }
  }, [mode, setValue]);

  React.useEffect(() => {
    if (mode === "time-based") {
      reset({
        timePerSet: [{ value: null }],
        restPerSet: [{ value: null }],
        repetitionPerSet: [],
        mode: "time-based",
      });
    } else {
      reset({
        timePerSet: [],
        restPerSet: [{ value: null }],
        repetitionPerSet: [{ value: null }],
        mode: "repetition-based",
      });
    }
  }, [mode, reset]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
    const timePerSetValues = data.timePerSet.map((item) => Number(item.value));
    const restPerSetValues = data.restPerSet.map((item) => Number(item.value));
    const repetitionPerSetValues = data.repetitionPerSet.map((item) =>
      Number(item.value)
    );

    console.log("Time Per Set:", timePerSetValues);
    console.log("Rest Per Set:", restPerSetValues);
    console.log("Repetition Per Set:", repetitionPerSetValues);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-gray-100 rounded-lg max-w-md mx-auto"
    >
      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="time-based"
            {...register("mode")}
            className="mr-2"
          />
          Time-Based
        </label>
        <label>
          <input
            type="radio"
            value="repetition-based"
            {...register("mode")}
            className="mr-2"
          />
          Repetition-Based
        </label>
      </div>

      {mode === "time-based" && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Time & Rest Per Set</h3>
          {timeFields.map((field, index) => (
            <div key={field.id} className="mb-4 flex items-center">
              <Controller
                name={`timePerSet.${index}.value` as const}
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className={`border p-2 rounded w-24 mr-4 ${
                      errors?.timePerSet?.[index] ? "border-red-500" : ""
                    }`}
                    min="0"
                    placeholder="Time"
                    value={field.value ?? ""}
                  />
                )}
              />
              {errors?.timePerSet?.[index] && (
                <span className="text-red-500 mr-4">
                  {errors.timePerSet[index]?.value?.message}
                </span>
              )}
              <Controller
                name={`restPerSet.${index}.value` as const}
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className={`border p-2 rounded w-24 mr-4 ${
                      errors?.restPerSet?.[index] ? "border-red-500" : ""
                    }`}
                    placeholder="Rest"
                    min="0"
                    value={field.value ?? ""}
                  />
                )}
              />
              {errors?.restPerSet?.[index] && (
                <span className="text-red-500 mr-4">
                  {errors.restPerSet[index]?.value?.message}
                </span>
              )}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    removeTime(index);
                    removeRest(index);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              appendTime({ value: null });
              appendRest({ value: null });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add More Time & Rest
          </button>
        </div>
      )}

      {mode === "repetition-based" && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Repetition & Rest Per Set
          </h3>
          {repetitionFields.map((field, index) => (
            <div key={field.id} className="mb-4 flex items-center">
              <Controller
                name={`repetitionPerSet.${index}.value` as const}
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className={`border p-2 rounded w-24 mr-4 ${
                      errors?.repetitionPerSet?.[index] ? "border-red-500" : ""
                    }`}
                    min="0"
                    value={field.value ?? ""}
                    placeholder="Reps"
                  />
                )}
              />
              {errors?.repetitionPerSet?.[index] && (
                <span className="text-red-500 mr-4">
                  {errors.repetitionPerSet[index]?.value?.message}
                </span>
              )}
              <Controller
                name={`restPerSet.${index}.value` as const}
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className={`border p-2 rounded w-24 mr-4 ${
                      errors?.restPerSet?.[index] ? "border-red-500" : ""
                    }`}
                    min="0"
                    placeholder="Rest"
                    value={field.value ?? ""}
                  />
                )}
              />
              {errors?.restPerSet?.[index] && (
                <span className="text-red-500 mr-4">
                  {errors.restPerSet[index]?.value?.message}
                </span>
              )}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    removeRepetition(index);
                    removeRest(index);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              appendRepetition({ value: null });
              appendRest({ value: null });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add More Reps & Rest
          </button>
        </div>
      )}

      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 w-full"
      >
        Submit
      </button>
    </form>
  );
};

export default MyForm;
