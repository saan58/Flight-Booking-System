import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the flight form schema
export const flightFormSchema = z.object({
  source: z.string().min(2).max(50),
  destination: z.string().min(2).max(50),
  checkin: z.string().min(10, {
    message: "Check-in should be a date in the format YYYY-MM-DD",
  }),
  checkout: z.string().min(10, {
    message: "Check-out should be a date in the format YYYY-MM-DD",
  }),
  passengers: z
    .string()
    .refine((value) => {
      if (value.includes(" Adult")) {
        return value.replace(/ Adult/g, "").length <= 2;
      }
      return false;
    }, {
      message: "Number of adults must be between 1 and 99",
      path: ["passengers"],
    })
    .transform((value: string) => parseInt(value.replace(" Adult", ""))),
  cabinClass: z
    .string()
    .refine((value) => {
      return ["Economy", "Premium Economy", "Business", "First Class"].includes(value);
    }, {
      message: "Invalid cabin class selected",
      path: ["cabinClass"],
    }),
});

function SearchFlightForm() {
  const form = useForm<z.infer<typeof flightFormSchema>>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      source: "",
      destination: "",
      checkin: "",
      checkout: "",
      passengers: 1,
      cabinClass: "Economy",
    },
  });

  const onSubmit = (data: any) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flight-search-form">
      <input type="text" placeholder="Origin" {...form.register("source")} />
      <input type="text" placeholder="Destination" {...form.register("destination")} />
      <input type="date" placeholder="Check-in" {...form.register("checkin")} />
      <input type="date" placeholder="Check-out" {...form.register("checkout")} />
      <input type="number" placeholder="Passengers" {...form.register("passengers")} />
      <select {...form.register("cabinClass")}>
        <option value="Economy">Economy</option>
        <option value="Premium Economy">Premium Economy</option>
        <option value="Business">Business</option>
        <option value="First Class">First Class</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchFlightForm;
