import React, { useState } from "react";
import { z, ZodError } from "zod";

// Define the Zod schema for a single time entry with both fields as arrays
const timeEntrySchema = z.object({
  time: z
    .array(z.string().nonempty("Each time is required"))
    .nonempty("At least one time is required"),
  restTime: z
    .array(z.string().nonempty("Each rest time is required"))
    .nonempty("At least one rest time is required"),
});

// Define the schema for an array of time entries
const timeEntriesSchema = z.array(timeEntrySchema);

const TimeInputsForm: React.FC = () => {
  const [entries, setEntries] = useState([{ time: "", restTime: "" }]);
  const [errors, setErrors] = useState<ZodError | null>(null);

  const handleChange = (
    index: number,
    field: "time" | "restTime",
    value: string
  ) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([...entries, { time: "", restTime: "" }]);
  };

  const removeEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = timeEntriesSchema.parse(
        entries.map((entry) => ({
          time: [entry.time],
          restTime: [entry.restTime],
        }))
      );
      setErrors(null);

      // Separate time and restTime into different arrays
      const timeArray = validatedData.map((entry) => entry.time);
      const restTimeArray = validatedData.map((entry) => entry.restTime);

      console.log("Time Arrays:", timeArray);
      console.log("Rest Time Arrays:", restTimeArray);
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(err);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md"
    >
      {entries.map((entry, index) => (
        <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
          <div className="mb-3">
            <label className="block font-semibold mb-1">
              Time:
              <input
                type="text"
                value={entry.time}
                onChange={(e) => handleChange(index, "time", e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            {errors?.issues.find(
              (issue) => issue.path[0] === index && issue.path[1] === "time"
            )?.message && (
              <div className="text-red-500 text-sm">
                {
                  errors.issues.find(
                    (issue) =>
                      issue.path[0] === index && issue.path[1] === "time"
                  )?.message
                }
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="block font-semibold mb-1">
              Rest Time:
              <input
                type="text"
                value={entry.restTime}
                onChange={(e) =>
                  handleChange(index, "restTime", e.target.value)
                }
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            {errors?.issues.find(
              (issue) => issue.path[0] === index && issue.path[1] === "restTime"
            )?.message && (
              <div className="text-red-500 text-sm">
                {
                  errors.issues.find(
                    (issue) =>
                      issue.path[0] === index && issue.path[1] === "restTime"
                  )?.message
                }
              </div>
            )}
          </div>
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              Remove Entry
            </button>
          )}
        </div>
      ))}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={addEntry}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add More Entries
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TimeInputsForm;
