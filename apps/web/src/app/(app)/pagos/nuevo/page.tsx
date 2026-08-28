import { PageHeader } from "@/components/layout/page-header";
import { PaymentForm } from "@/components/forms/payment-form";
import { addPago } from "../actions";

export default function NuevoPagoPage() {
  return (
    <>
      <PageHeader title="Nuevo pago" />
      <PaymentForm action={addPago} />
    </>
  );
}
