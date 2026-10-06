"use server";

import { reasignarPagoACuenta } from "@/lib/motor";

export async function reasignarPago(pagoId: number, cuentaId: number) {
  return reasignarPagoACuenta(pagoId, cuentaId);
}
