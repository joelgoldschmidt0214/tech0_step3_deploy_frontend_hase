export default async function updateCustomer(internalId, formData) { // internalId を引数で受け取る
  const updated_customer_name = formData.get("customer_name");
  const updated_customer_id = formData.get("customer_id");
  const updated_age = parseInt(formData.get("age"));
  const updated_gender = formData.get("gender");

  const body_msg = JSON.stringify({
    customer_name: updated_customer_name,
    customer_id: updated_customer_id,
    age: updated_age,
    gender: updated_gender,
  });

  const apiUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customers/${internalId}`; 
  console.log(`[updateCustomer] Attempting to update. URL: ${apiUrl}, Method: PUT, Body: ${body_msg}`); // 詳細なログ出力

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body_msg,
  });
  if (!res.ok) {
    throw new Error("Failed to update customer");
  }
}
