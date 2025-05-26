"use client";
import OneCustomerInfoCard from "@/app/components/one_customer_info_card.jsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import fetchCustomers from "./fetchCustomers";
// import readAllCustomer from "./allCustomers"

export default function Page() {
  const [customerInfos, setCustomerInfos] = useState([]);

  useEffect(() => {
    const fetchAndSetCustomer = async () => {
      try {
        const apiUrlBase = process.env.NEXT_PUBLIC_API_ENDPOINT;
        console.log("API URL Base for fetch:", apiUrlBase); // これが undefined かどうか

        if (!apiUrlBase) {
          console.error("API Endpoint is not defined! Cannot fetch customers.");
          return;
        }

        const response = await fetch(`${apiUrlBase}/allcustomers`); // FastAPIのエンドポイントを想定
        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.status} ${response.statusText}`);
        }
        const customerData = await response.json();
        setCustomerInfos(customerData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    fetchAndSetCustomer();
  }, []);

  // return (
  //   <>
  //   <div>{fetchAndSetCustomer()}</div>
  //   </>
  // );
  useEffect(() => {
    console.log('test', process.env.NEXT_PUBLIC_API_ENDPOINT);
  }, []);

  return (
    <>
      <div className="p-4">
        <Link href="/customers/create" className="mt-4 pt-4" prefetch={false}>
          <button className="btn btn-neutral w-full border-0 bg-blue-200 text-black hover:text-white">
            Create
          </button>
        </Link>
      </div>
      {/* <div className="p-4">{customerInfos.length} test</div> */}
      {/* {false ? (<div>true</div>):(<div>false</div>)} */}
      {customerInfos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerInfos.map((customerInfo) => (
            <div
              key={customerInfo.internal_id}
              className="card bordered bg-white border-blue-200 border-2 flex flex-row max-w-sm m-4"
            >
              <OneCustomerInfoCard {...customerInfo} />
              <div className="card-body flex flex-col justify-between">
                <Link href={`/customers/read/${customerInfo.internal_id}`}>
                  <button className="btn btn-neutral w-20 border-0 bg-blue-200 text-black hover:text-white">
                    Read
                  </button>
                </Link>
                <Link href={`/customers/update/${customerInfo.internal_id}`}>
                  <button className="btn btn-neutral w-20 border-0 bg-blue-200 text-black hover:text-white">
                    Update
                  </button>
                </Link>
                <Link href={`/customers/delete/${customerInfo.internal_id}`}>
                  <button className="btn btn-neutral w-20 border-0 bg-blue-200 text-black hover:text-white">
                    Delete
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4">
          <p>顧客情報がありません。</p>
        </div>
      )}
    </>
  );
}
