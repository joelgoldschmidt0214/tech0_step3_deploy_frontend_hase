// /frontend/src/app/customers/create/confirm/page.jsx
"use client";
import OneCustomerInfoCard from "@/app/components/one_customer_info_card.jsx";
import fetchCustomer from "./fetchCustomer";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react"; // Suspense を追加


function ConfirmCreateContent() { // Suspense のためにコンテンツ部分を別コンポーネントに
  const router = useRouter();
  const searchParams = useSearchParams();
  const internalId = searchParams.get("internal_id");

  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (internalId) {
      console.log(
        `[ConfirmCreatePage] useEffect: Fetching customer with internal_id: ${internalId}`
      );
      const loadCustomer = async () => {
        setLoading(true);
        setError(null);
        try {
          const customerData = await fetchCustomer(internalId);
          setCustomerInfo(customerData);
        } catch (err) {
          console.error(
            "[ConfirmCreatePage] Error fetching customer:",
            err
          );
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      loadCustomer();
    } else {
      console.warn(
        "[ConfirmCreatePage] internal_id not found in query params."
      );
      setError("Customer ID not provided for confirmation.");
      setLoading(false);
    }
  }, [internalId]);

  if (loading)
    return <div className="p-4 text-center">Loading customer details...</div>;
  if (error)
    return (
      <div className="p-4 text-center text-red-500">
        Error loading customer details: {error}
      </div>
    );
  if (!customerInfo)
    return (
      <div className="p-4 text-center">
        Customer details could not be loaded.
      </div>
    );

  return (
    <div className="card bordered bg-white border-blue-200 border-2 max-w-sm m-4">
      <div className="alert alert-success p-4 text-center">
        正常に作成しました
      </div>
      <OneCustomerInfoCard {...customerInfo} />
      <button onClick={() => router.push("/customers")}>
        <div className="btn btn-primary m-4 text-2xl">顧客一覧へ戻る</div>
      </button>
    </div>
  );
}


export default function ConfirmCreatePageWrapper() {
  return (
    // useSearchParams は Suspense でラップする必要がある
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <ConfirmCreateContent />
    </Suspense>
  );
}