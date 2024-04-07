// import React from 'react'
import { fetchFlightResults } from "@/lib/fetchFlightResults";
import Link from "next/link";
import { notFound } from "next/navigation";


type Props = {
    searchParams: SearchParams;
  };


  export type SearchParams = {
    url: URL;
    type: string;
    adults: string;
    to: string;
    from: string;
    depart: string;
    return: string;
    fromLocationName: string;
    toLocationName: string;
    
  };



async function FlightSearchPage({searchParams}: Props) {
    if (!searchParams.url) return notFound();

    const results = await fetchFlightResults(searchParams);

    if (!results ||!results.content ||!results.content.flights) return <div>No results...</div>;
    // if(!results) return <div>No results....</div>

    // console.log(results);

    return (
      <section>
        <div className="mx-auto max-w-7xl p-6 lg:px-8">
          <h1 className="text-4xl font-bold pb-3">Your Flight Results</h1>
  
          <h2 className="pb-3">
            Dates of Flight trip:
            <span className="italic ml-2">
              {searchParams.depart} to {searchParams.return}
            </span>
          </h2>
  
          <hr className="mb-5" />
  
          {/* <h3 className="font-semibold text-xl">
            {results.content.total_listings}
          </h3> */}
  
          <div className="space-y-2 mt-5">
            {results.content.flights.map((item, i) => (
              <div
                key={i}
                className="flex space-y-2 justify-between space-x-4 p-5 border rounded-lg"
              >
                <img
                  src={item.url}
                  alt="image of property"
                  className="h-44 w-44 rounded-lg"
                />
  
                <div className="flex flex-1 space-x-5 justify-between">
                  <div>
                    <p className="font-bold">{item.depart_time0}</p>
                    <p className="text-xs">{item.depart_airport0}</p>
                    <p className="text-xs">{item.depart_date0}</p>                       
                  </div>
  
                  <div className="flex items-start justify-end space-x-2 text-center">
                      <p className="text-xs">{item.duration0}</p>
                      <p className="text-xs">{item.stops0}</p>
                    </div>


                  <div className="flex flex-col justify-between">
                    <div className="flex items-start justify-end space-x-2 text-right">
                      <p className="font-bold">{item.destination_time0}</p>
                      <p className="text-xs">{item.destination_airport0}</p>
                      <p className="text-xs">{item.destination_date0}</p>
                    </div>


                    <div>
                    <p className="font-bold">{item.depart_time1}</p>
                    <p className="text-xs">{item.depart_airport1}</p>
                    <p className="text-xs">{item.depart_date1}</p>                       
                  </div>

                  <div className="flex items-start justify-end space-x-2 text-center">
                      <p className="text-xs">{item.duration1}</p>
                      <p className="text-xs">{item.stops1}</p>
                    </div>

                    <div className="flex items-start justify-end space-x-2 text-right">
                      <p className="font-bold">{item.destination_time1}</p>
                      <p className="text-xs">{item.destination_airport1}</p>
                      <p className="text-xs">{item.destination_date1}</p>
                    </div>



                    <div className="text-right">
                      <p className="text-2xl font-bold">{item.total_price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}

export default FlightSearchPage
