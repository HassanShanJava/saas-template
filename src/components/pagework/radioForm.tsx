import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  gender: z
    .enum(["male", "female", "prefer not to say"])
    .or(z.string().optional())
    .refine((val) => val !== undefined && val !== "", {
      message: "Please select a gender.",
    }),
});





function RadioGrouponeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "prefer not to say",
    },
  });

  const onSubmit = (data:any) => {
    console.log(data); // Do something with the form data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          <input type="radio" value="male" {...register("gender")} />
          Male
        </label>
        <label>
          <input type="radio" value="female" {...register("gender")} />
          Female
        </label>
        <label>
          <input
            type="radio"
            value="prefer not to say"
            {...register("gender")}
          />
          Prefer not to say
        </label>
      </div>
      {errors.gender && typeof errors.gender.message === "string" && (
        <p>{errors.gender.message}</p>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}

export default RadioGrouponeForm;
