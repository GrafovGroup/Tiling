/** Submit once; never silently retry a lead because the first attempt may have arrived. */
export async function submitQuoteRequest(endpoint: string, form: FormData, fetcher: typeof fetch = fetch, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(endpoint, {
      method: "POST", body: form, headers: { Accept: "application/json" }, signal: controller.signal,
    });
    const result = await response.json().catch(() => null) as { ok?: boolean; errors?: { message?: string }[] } | null;
    if (!response.ok || result?.ok !== true) {
      const message = result?.errors?.map(item => item.message).filter(Boolean).join(" ");
      throw new Error(message || "We could not confirm receipt of your request.");
    }
  } catch (error) {
    if (controller.signal.aborted) throw new Error("Confirmation is taking too long. Your request may have arrived; please contact us before submitting again.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
