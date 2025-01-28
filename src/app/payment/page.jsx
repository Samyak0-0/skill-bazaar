import React from "react";

const page = () => {
  return (
    <div className="top-[10vh] relative text-black bg-red-300">
      <form
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
        className="flex flex-col"
      >
        <input type="text" id="amount" name="amount" value="900" required />
        <input
          type="text"
          id="tax_amount"
          name="tax_amount"
          value="0"
          required
        />
        <input
          type="text"
          id="total_amount"
          name="total_amount"
          value="900"
          required
        />
        <input
          type="text"
          id="transaction_uuid"
          name="transaction_uuid"
          value="cm6gihmel001zu8rweu8inl6v"
          className="bg-green-400"
          required
        />
        <input
          type="text"
          id="product_code"
          name="product_code"
          value="EPAYTEST"
          required
        />
        <input
          type="text"
          id="product_service_charge"
          name="product_service_charge"
          value="0"
          required
        />
        <input
          type="text"
          id="product_delivery_charge"
          name="product_delivery_charge"
          value="0"
          required
        />
        <input
          type="text"
          id="success_url"
          name="success_url"
          value="http://localhost:3000/api/esewa-payment"
          required
        />
        <input
          type="text"
          id="failure_url"
          name="failure_url"
          value="https://developer.esewa.com.np/failure"
          required
        />
        <input
          type="text"
          id="signed_field_names"
          name="signed_field_names"
          value="total_amount,transaction_uuid,product_code"
          required
        />
        <input
          type="text"
          id="signature"
          name="signature"
          className="bg-red-500"
          value="83AYDtSjjHpji6nxOgnpVm5UdkG2NZSlTnSP6Gikx5E="
          required
        />
        <input value="Submit" type="submit" />
      </form>
    </div>
  );
};

export default page;
