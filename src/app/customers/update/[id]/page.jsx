"use client";
import { useEffect, useState, useRef, use } from "react";
import { useRouter, useParams } from "next/navigation"; // useParams をインポート
import fetchCustomer from "./fetchCustomer";
import updateCustomer from "./updateCustomer";

export default function UpdatePage(props) { // props は通常 App Router では直接使いません
  const router = useRouter();
  const params = useParams(); // useParams を使ってパラメータを取得
  const id = params.id; // これが internal_id
  const formRef = useRef();
  const [customerInfo, setCustomerInfo] = useState(null); // 初期値をnullに
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) { // id が利用可能になってから実行
      const fetchAndSetCustomer = async () => {
        setLoading(true);
        setError(null);
        try {
          const customerData = await fetchCustomer(id); // fetchCustomer で個別の顧客情報を取得
          setCustomerInfo(customerData);
        } catch (err) {
          console.error("Failed to fetch customer for update:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAndSetCustomer();
    }
  }, [id]); // id が変更されたら再実行

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    if (!id) {
      console.error("Internal ID (id) is missing, cannot update.");
      // ユーザーにエラーを通知する処理
      return;
    }
    console.log(`[UpdatePage] handleSubmit: Updating customer with internal_id: ${id}`); // デバッグ用

    try {
      // ★★★ updateCustomer に id (internal_id) と formData を渡す ★★★
      await updateCustomer(id, formData);
      console.log("Customer updated successfully!");
      // 更新後、確認ページにリダイレクト (internal_id を使用)
      router.push(`/customers/update/${id}/confirm`); 
      // または一覧ページにリダイレクト
      // router.push('/customers');
    } catch (err) {
      console.error("Failed to update customer:", err);
      // ユーザーにエラーメッセージを表示する処理
      setError(err.message || "An unknown error occurred during update.");
    }
  };

  // ローディングとエラー表示
  if (loading) return <div className="p-4 text-center">Loading customer data...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (!customerInfo) return <div className="p-4 text-center">Customer data not found.</div>;

  // フォームの defaultValue には、customerInfo から取得した値を使用
  // customerInfo が null の可能性があるため、オプショナルチェイニング(?.)を使うか、
  // 上記のローディング/エラー/データなしの状態で早期リターンする
  const previous_customer_name = customerInfo?.customer_name || '';
  const previous_customer_id = customerInfo?.customer_id || '';
  const previous_age = customerInfo?.age || '';
  const previous_gender = customerInfo?.gender || '';

  return (
    <>
      <div className="card bordered bg-white border-blue-200 border-2 max-w-md m-4">
        <div className="m-4 card bordered bg-blue-200 duration-200 hover:border-r-red">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="card-body">
              <h2 className="card-title">
                <p>
                  <input
                    type="text"
                    name="customer_name"
                    defaultValue={previous_customer_name}
                    className="input input-bordered"
                  />
                  さん
                </p>
              </h2>
              <p>
                Customer ID:
                <input
                  type="text"
                  name="customer_id" // この名前はFastAPIのPydanticモデルのcustomer_idフィールドと一致させる
                  defaultValue={previous_customer_id}
                  className="input input-bordered"
                />
              </p>
              <p>
                Age:
                <input
                  type="number"
                  name="age"
                  defaultValue={previous_age}
                  className="input input-bordered"
                />
              </p>
              <p>
                Gender:
                <input
                  type="text"
                  name="gender"
                  defaultValue={previous_gender}
                  className="input input-bordered"
                />
              </p>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="btn btn-primary m-4 text-2xl">更新</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}