import { FlightSearchParams } from "@/app/FlightSearch/page";
import { FlightResult } from "@/typings";

export async function fetchFlightResults(searchFlightsParams: FlightSearchParams) {
  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  // Prepare the URL based on the provided search parameters
  const url = new URL('https://example.com/flights/search');
  Object.keys(searchFlightsParams).forEach((key) => {
    if (key === "url" || key === "location") return;

    const value = searchFlightsParams[key as keyof FlightSearchParams];

    if (typeof value === "string") {
      url.searchParams.append(key, value);
    }
  });

  console.log("Scraping flight search URL >>>", url.href);

  const body = {
    source: "universal",
    url: url.href,
    parse: true,
    render: "html",
    parsing_instructions: {
      flights: {
        _fns: [
          {
            _fn: "css",
            _args: ["div.flight-results .flight"],
          },
        ],
        _items: {
          departure_airport: {
            _fns: [
              {
                _fn: "css_one",
                _args: ["span.departure-airport"],
              },
            ],
          },
          arrival_airport: {
            _fns: [
              {
                _fn: "css_one",
                _args: ["span.arrival-airport"],
              },
            ],
          },
          departure_time: {
            _fns: [
              {
                _fn: "css_one",
                _args: ["time.departure-time"],
              },
            ],
          },
          arrival_time: {
            _fns: [
              {
                _fn: "css_one",
                _args: ["time.arrival-time"],
              },
            ],
          },
          airline: {
            _fns: [
              {
                _fn: "css_one",
                _args: ["span.airline"],
              },
            ],
          },
          price: {
            _fns: [
              {
                _fn: "css_one",
                _args: ["span.price"],
              },
            ],
          },
          link: {
            _fns: [
              {
                _fn: "css_one",
                _args: ["a.book-link"],
              },
            ],
          },
          duration: {
            _fns: [
              {
                _fn: "css_one",
                _args: ["span.duration"],
              },
            ],
          },
          // Add more flight details as required
        },
      },
      total_flights: {
        _fns: [
          {
            _fn: "css_one",
            _args: ["h1.search-results-count"],
          },
        ],
      },
    },
  };

  const response = await fetch("https://realtime.oxylabs.io/v1/queries", {
    method: "POST",
    body: JSON.stringify(body),
    next: {
      revalidate: 60 * 60, // cache for 1 hour
    },
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.results || data.results.length === 0) {
// Handle case where results are undefined or empty
        console.log("No flight results found");
        return null; // Return null or appropriate value
      }

      const result: FlightResult = data.results[0];
      return result;
    })
    .catch((err) => {
      // Handle fetch or parsing errors
      console.error("Error fetching flight results:", err);
      return null; // Return null or appropriate value
    });

    return response ? [response] : null;
}