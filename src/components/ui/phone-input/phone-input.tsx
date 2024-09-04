import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"; // Import the default styles for the phone input
import { z } from "zod";

const schema = z.object({
  phone: z.string().min(1, "Phone number is required"),
});

type FormData = z.infer<typeof schema>;

const PhoneForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="pt-3">
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <div className="relative">
              <span className="absolute p-0 text-xs left-[3.3rem] -top-2 px-1 bg-white z-10">
                Phone Number
              </span>
              <PhoneInput placeholder=" " value={value} onChange={onChange} />
            </div>
          )}
        />
        {errors.phone && <p>{errors.phone.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PhoneForm;
