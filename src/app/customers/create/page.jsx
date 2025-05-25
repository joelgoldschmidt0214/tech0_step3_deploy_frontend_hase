// /frontend/src/app/customers/create/page.jsx
"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import createCustomer from "./createCustomer"; // サーバーアクションをインポート

export default function CreatePage() {
  const formRef = useRef();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(formRef.current);

    try {
      // サーバーアクションを呼び出し、結果を受け取る
      const result = await createCustomer(formData);

      if (result.success && result.internal_id) {
        console.log("Server action successful, internal_id:", result.internal_id);
        // Confirmページに internal_id をクエリパラメータとして渡して遷移
        router.push(`/customers/create/confirm?internal_id=${result.internal_id}`);
      } else {
        console.error("Server action failed or did not return internal_id:", result.error);
        setError(result.error || "Failed to create customer.");
      }
    } catch (err) { // サーバーアクション自体が throw したエラー (通常はサーバーアクション内でキャッチしてオブジェクトを返す)
      console.error("Error calling server action:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* エラーメッセージの表示 */}
      {error && (
        <div className="alert alert-error p-4 m-4 shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      {/* 入力フォームのJSX */}
      <div className="card bordered bg-white border-blue-200 border-2 max-w-md m-4">
        <div className="m-4 card bordered bg-blue-200 duration-200 hover:border-r-red">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="card-body">
              <h2 className="card-title">
                <p>
                  <input
                    type="text"
                    name="customer_name"
                    placeholder="桃太郎"
                    className="input input-bordered w-full" // w-full を追加して幅を調整
                    required // 必須項目
                  />
                </p>
              </h2>
              <div className="form-control w-full"> {/* 各入力フィールドを form-control でラップ */}
                <label className="label">
                  <span className="label-text">Customer ID (Legacy)</span>
                </label>
                <input
                  type="text"
                  name="customer_id"
                  placeholder="C030"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Age</span>
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="30"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <input
                  type="text"
                  name="gender"
                  placeholder="女"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>
            <div className="flex justify-center card-actions p-4"> {/* card-actions と p-4 を追加 */}
              <button
                type="submit"
                className="btn btn-primary text-xl" // text-2xl から text-xl に変更 (任意)
                disabled={isSubmitting}
              >
                {isSubmitting ? "作成中..." : "作成"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}