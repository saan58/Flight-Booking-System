"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
// import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { BedDoubleIcon, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";

const cityAirportMap = {
  Pune: "PNQ.AIRPORT",
  Mumbai: "BOM.AIRPORT",
  "New York": "JFK.AIRPORT",
  "Los Angeles": "LAX.AIRPORT",
  //add more city codes
} as const;

type City = keyof typeof cityAirportMap; // Define the type for city names


const cityLocationMap = {
  Pune: "Pune International Airport",
  Mumbai: "Chhatrapati Shivaji International Airport Mumbai",
  "New York": "Newark Liberty International Airport",
  "Los Angeles": "Los Angeles International Airport",
} as const;

type CityLocation = keyof typeof cityLocationMap; // Define the type for city locations




// Define the flight form schema
export const flightFormSchema = z.object({
  source: z.string().min(2).max(50),
  destination: z.string().min(2).max(50),
  // checkin: z.string().min(10, {
  //   message: "Check-in should be a date in the format YYYY-MM-DD",
  // }),
  // checkout: z.string().min(10, {
  //   message: "Check-out should be a date in the format YYYY-MM-DD",
  // }),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
  // passengers: z
  //   .string()
  //   .refine((value) => {
  //     if (value.includes(" Adult")) {
  //       return value.replace(/ Adult/g, "").length <= 2;
  //     }
  //     return false;
  //   }, {
  //     message: "Number of adults must be between 1 and 99",
  //     path: ["passengers"],
  //   })
  //   .transform((value: string) => parseInt(value.replace(" Adult", ""))),
  adults: z
    .string()
    .min(1, {
      message: "Please select at least 1 adult",
    })
    .max(12, { message: "Max 12 adults Occupancy" }),
  children: z.string().min(0).max(12, {
    message: "Max 12 children Occupancy",
  }),
  cabinClass: z
    .string()
    .refine((value) => {
      return ["Economy", "Premium Economy", "Business", "First Class"].includes(value);
    }, {
      message: "Invalid cabin class selected",
      path: ["cabinClass"],
    }),
  tripType: z.string().refine((value) => {
      return ["roundTrip", "oneWay", "multiCity"].includes(value);
    }, {
      message: "Invalid trip type selected",
      path: ["tripType"],
    }),
  directFlightsOnly: z.boolean(),

});

function FlightSearchForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof flightFormSchema>>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      source: "",
      destination: "",
      dates: {
        from: undefined,
        to: undefined,
      },
      adults: "1",
      children: "0",
      // passengers: 1,
      cabinClass: "Economy",
      tripType: "roundTrip",
      directFlightsOnly: false,

    },
  });

  // const onSubmit = (data: any) => {
  //   // Handle form submission
  //   console.log(data);
  // };

  function onSubmit(values: z.infer<typeof flightFormSchema>) {
    console.log(values);

    const checkin_monthday = values.dates.from.getDate().toString();
    const checkin_month = (values.dates.from.getMonth() + 1).toString();
    const checkin_year = values.dates.from.getFullYear().toString();
    const checkout_monthday = values.dates.to.getDate().toString();
    const checkout_month = (values.dates.to.getMonth() + 1).toString();
    const checkout_year = values.dates.to.getFullYear().toString();

    // const checkin = `${checkin_year}-${checkin_month}-${checkin_monthday}`;
    // const checkout = `${checkout_year}-${checkout_month}-${checkout_monthday}`;

    const checkin = formatDate(values.dates.from);
    const checkout = formatDate(values.dates.to);

    const sourceCode = cityAirportMap[values.source as City] || "PNQ.AIRPORT";
    const destinationCode = cityAirportMap[values.destination as City] || "BOM.AIRPORT";

    const sourceLocation = cityLocationMap[values.source as CityLocation] || "Pune International Airport";
    const destinationLocation = cityLocationMap[values.destination as CityLocation] || "Chhatrapati Shivaji International Airport Mumbai";


    const url = new URL("https://flights.booking.com/flights/PNQ.AIRPORT-BOM.AIRPORT/");
    url.searchParams.set("type", "ROUNDTRIP");
    url.searchParams.set("adults", values.adults);
    url.searchParams.set("cabinClass", "ECONOMY");
    url.searchParams.set("from", sourceCode);
    url.searchParams.set("to", destinationCode);
    url.searchParams.set("depart", checkin);
    url.searchParams.set("return", checkout);
    url.searchParams.set("fromLocationName", sourceLocation);
    url.searchParams.set("toLocationName", destinationLocation);


    router.push(`/FlightSearch?url=${url.href}`); 
  
  }
  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row lg:max-w-6xl lg:mx-auto items-center justify-center space-x-0 lg:space-x-2 space-y-4 lg:space-y-0 rounded-lg"
      >
        <div className="grid w-full lg:max-w-sm items-center gap-1.5">
        <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white flex">
                  Source 
                  <BedDoubleIcon className="ml-2 h-4 w-4 text-white" />
                </FormLabel>

                <FormMessage />

                <FormControl>
                  <Input placeholder="PNQ.AIRPORT" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid w-full lg:max-w-sm items-center gap-1.5">
        <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white flex">
                  Destination 
                  <BedDoubleIcon className="ml-2 h-4 w-4 text-white" />
                </FormLabel>

                <FormMessage />

                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid w-full lg:max-w-sm flex-1 items-center gap-1.5">
          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-white">Dates</FormLabel>
                <FormMessage />

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        id="date"
                        name="dates"
                        variant={"outline"}
                        className={cn(
                          "w-full lg:w-[300px] justify-start text-left font-normal",
                          !field.value.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4 opacity-50" />
                        {field.value?.from ? (
                          field.value?.to ? (
                            <>
                              {format(field.value?.from, "LLL dd, y")} -{" "}
                              {format(field.value?.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(field.value?.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Select your dates</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      selected={field.value}
                      defaultMonth={field.value.from}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full items-center space-x-2">
          <div className="grid items-center flex-1">
            <FormField
              control={form.control}
              name="adults"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white">Adults</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input type="number" placeholder="Adults" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid items-center flex-1">
            <FormField
              control={form.control}
              name="children"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white">Children</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input type="number" placeholder="Children" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="mt-auto">
            <Button type="submit" className="bg-blue-500 text-base">
              Search
            </Button>
          </div>
        </div>




      </form>

    </Form>

    // <form onSubmit={form.handleSubmit(onSubmit)} className="flight-search-form">
    //   <input type="text" placeholder="Origin" {...form.register("source")} />
    //   <input type="text" placeholder="Destination" {...form.register("destination")} />
    //   <input type="date" placeholder="Check-in" {...form.register("checkin")} />
    //   <input type="date" placeholder="Check-out" {...form.register("checkout")} />
    //   <input type="number" placeholder="Passengers" {...form.register("passengers")} />
    //   <select {...form.register("cabinClass")}>
    //     <option value="Economy">Economy</option>
    //     <option value="Premium Economy">Premium Economy</option>
    //     <option value="Business">Business</option>
    //     <option value="First Class">First Class</option>
    //   </select>
    //   <button type="submit">Search</button>
    // </form>
  );
}
// }

export default FlightSearchForm;
