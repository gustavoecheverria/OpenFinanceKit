/**
 * Estado que devuelven las Server Actions de captura.
 * - error: mensaje amigable cuando algo falla; null si todo ok.
 * - ok: true cuando la operación se completó (el cliente navega tras esto).
 *
 * Se usa con useActionState. La navegación tras éxito se hace en el cliente
 * (useRouter) en vez de redirect() en el servidor, porque redirect() dentro
 * de useActionState puede no propagarse de forma confiable en Next.js.
 */
export type FormState = {
  error: string | null;
  ok?: boolean;
};

export const initialFormState: FormState = { error: null };
