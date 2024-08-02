import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import formSchema from "./../../../schema/setSchema";

type FormData = z.infer<typeof formSchema>;

const DynamicForm: React.FC = () => {
  const [numberOfSets, setNumberOfSets] = useState<number>(3); // Default number of sets

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Number of Sets:</label>
        <input
          type="number"
          value={numberOfSets}
          onChange={(e) => setNumberOfSets(Number(e.target.value))}
          min={1}
        />
      </div>

      {[...Array(numberOfSets)].map((_, index) => (
        <div key={index}>
          <div>
            <label>Set {index + 1} Time:</label>
            <input
              type="number"
              {...register(`sets.${index}.time`, { valueAsNumber: true })}
            />
            {errors.sets?.[index]?.time && (
              <p>{errors.sets[index].time.message}</p>
            )}
          </div>
          <div>
            <label>Set {index + 1} Rest:</label>
            <input
              type="number"
              {...register(`sets.${index}.rest`, { valueAsNumber: true })}
            />
            {errors.sets?.[index]?.rest && (
              <p>{errors.sets[index].rest.message}</p>
            )}
          </div>
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
};

export default DynamicForm;
