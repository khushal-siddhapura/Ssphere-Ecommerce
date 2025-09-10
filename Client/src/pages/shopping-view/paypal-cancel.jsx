import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

function PaypalCancelPage() {
  // const dispatch = useDispatch();
  // const location = useLocation();
  // const params = new URLSearchParams(location.search);
  // const paymentId = params.get("paymentId");
  // const payerId = params.get("PayerID");

  useEffect(() => {
    // if (paymentId && payerId) {
    //   console.log("paymentId==>>>", paymentId)
    //   const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
    //   dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
    //     if (data?.payload?.success) {
    //       sessionStorage.removeItem("currentOrderId");
    //       window.location.href = "/shop/payment-success";
    //     }
    //   });
    // }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gray-500">
          Opps Unfortunately your payment is not processed Can you please try
          again!
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalCancelPage;
