// "use client";
// import { useState } from 'react';
// import { fetchFlightResults } from '@/lib/fetchFlightResults';
// import { FlightResult } from "@/typings";

// type Props = {
//   searchParams: FlightSearchParams;
// };

// export type FlightSearchParams = {
//   url: URL;
//   origin: string,
//   destination: string,
//   departureDate: string ,
//   returnDate: string,
//   passengers: number
// };

// export default function FlightSearch() {
//   const [searchParams, setSearchParams] = useState<FlightSearchParams>({ // Specify FlightSearchParams type
//     url: new URL('http://localhost:3000/FlightSearch'), // Initialize URL with a default value
//     origin: '',
//     destination: '',
//     departureDate: '',
//     returnDate: '',
//     passengers: 1,
//   });
//   const [results, setResults] = useState<FlightResult[] | null>(null); // Specify Flight[] type for results state
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null); // Specify string type for error state

//   const handleSearch = async () => {
//     setLoading(true);
//     setError(null); // Reset error state
//     try {
//       const flightResults = await fetchFlightResults(searchParams);
//       if (flightResults === null) {
//         setError('Error fetching flight results. Please try again.');
//       } else {
//         setResults(flightResults);
//       }
//     } catch (error) {
//       setError('Error fetching flight results. Please try again.');
//       console.error('Error fetching flight results:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Specify event type
//     const { name, value } = e.target;
//     setSearchParams({ ...searchParams, [name]: value });
//   };

//   return (
//     <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px' }}> {/* Apply CSS here */}
//       <h1 style={{ color: 'blue' }}>Flight Search</h1> {/* Apply CSS here */}
//       <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
//         <label>
//           Origin:
//           <input type="text" name="origin" value={searchParams.origin} onChange={handleChange} required />
//         </label>
//         <label>
//           Destination:
//           <input type="text" name="destination" value={searchParams.destination} onChange={handleChange} required />
//         </label>
//         <label>
//           Departure Date:
//           <input type="date" name="departureDate" value={searchParams.departureDate} onChange={handleChange} required />
//         </label>
//         <label>
//           Return Date:
//           <input type="date" name="returnDate" value={searchParams.returnDate} onChange={handleChange} required />
//         </label>
//         <label>
//           Passengers:
//           <input type="number" name="passengers" value={searchParams.passengers} onChange={handleChange} min="1" />
//         </label>
//         <button type="submit" disabled={loading}>Search</button>
//       </form>

//       {loading && <p>Loading...</p>}
//       {error && <p>{error}</p>}

//       {results && (
//         <div>
//           <h2>Search Results</h2>
//           {/* Check if results is not empty before mapping */}
//           {results.length > 0 && results.map((flight, index) => (
//             <div key={index}>
//               <p>{flight.origin} to {flight.destination}</p>
//               <p>Departure: {flight.departureDate}</p>
//               <p>Return: {flight.returnDate}</p>
//               <p>Price: {flight.price}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import FlightSearchForm from "@/components/FlightSearchForm";
//import { trending_data } from "@/data/trending";

export default function Home() {
  return (
    <main className="bg-[#013B94]">
      <section className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-5xl text-white">Compare and book flights with ease</h2>
        <h3 className="text-white py-5 text-xl">
        Discover your next dream destination
        </h3>
      </section>

      <section className="m-4 mt-0 -mb-14 px-2 lg:px-4">
        <FlightSearchForm />
      </section>

      
    </main>
  );
}
