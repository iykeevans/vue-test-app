import axios from "axios";

const getToken = () => localStorage.getItem("access_token");

export const $_login = (payload) => {
  console.log(payload);

  return axios.post(
    "http://test.ansppb.an.gov.ng/api/auth/login/staff",
    payload
  );
};

export const $_getPaymentHistory = (payload) => {
  const headers = {
    authorization: `Bearer ${getToken()}`,
  };

  return axios.get(
    "http://test.ansppb.an.gov.ng/api/payment_histories",
    {
      headers,
    },
    { id: payload }
  );
};

export const $_updatePaymentHistory = ({ id, ...rest }) => {
  const headers = {
    authorization: `Bearer ${getToken()}`,
  };

  return axios.patch(
    `http://test.ansppb.an.gov.ng/api/payment_histories/${id}`,
    rest,
    {
      headers,
    }
  );
};

export const $_deletePaymentHistory = (payload) => {
  const headers = {
    authorization: `Bearer ${getToken()}`,
  };

  return axios.delete(
    `http://test.ansppb.an.gov.ng/api/payment_histories/${payload}`,
    {
      headers,
    }
  );
};
