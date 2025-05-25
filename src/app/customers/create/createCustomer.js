// /frontend/src/app/customers/create/createCustomer.js
"use server";
import { revalidatePath } from "next/cache";

const createCustomer = async (formData) => {
  const creating_customer_name = formData.get("customer_name");
  const creating_customer_id = formData.get("customer_id");
  const creating_age = parseInt(formData.get("age")); // 数値に変換
  const creating_gender = formData.get("gender");

  const body_msg = JSON.stringify({
    customer_name: creating_customer_name,
    customer_id: creating_customer_id,
    age: creating_age,
    gender: creating_gender,
  });

  const apiUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customers`;
  console.log(`[Server Action - createCustomer] API URL: ${apiUrl}, Body: ${body_msg}`);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body_msg,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null); // エラーレスポンスのパースを試みる
      console.error(
        `[Server Action - createCustomer] API Error: ${res.status}`,
        errorData
      );
      // エラーメッセージをより具体的にする (任意)
      throw new Error(
        `Failed to create customer: ${res.status} ${
          errorData?.detail || res.statusText || "Unknown server error"
        }`
      );
    }
    
    // 成功した場合、レスポンスボディから作成された顧客情報を取得 (FastAPIは返してくれるはず)
    const createdCustomer = await res.json();
    console.log("[Server Action - createCustomer] Customer created:", createdCustomer);

    revalidatePath(`/customers`); // 一覧ページのキャッシュを無効化
    revalidatePath(`/customers/create/confirm`); // Confirmページも再検証 (もし必要なら)
    // revalidatePath(`/customers/read/${createdCustomer.internal_id}`); // 作成された顧客の詳細ページも再検証

    // サーバーアクションから値を返すこともできるが、ここではリダイレクトやUI更新を revalidate に任せる
    // return { success: true, data: createdCustomer }; // 例えばこのように返すことも可能
    return { success: true, internal_id: createdCustomer.internal_id }; // internal_id を返すように変更


  } catch (error) {
    console.error("[Server Action - createCustomer] Catch Error:", error);
    // クライアント側でエラーをハンドルできるように、エラーオブジェクトやメッセージを返す
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
};

export default createCustomer;