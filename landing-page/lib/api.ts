const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // Use same-origin /api/* — proxied by next.config.ts rewrites (no CORS in dev)
  if (!API_BASE) {
    return normalizedPath;
  }
  return `${API_BASE}${normalizedPath}`;
}

export async function fetchFromApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(getApiUrl(path), init);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export type SubmitInquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export type SubmitInquiryResponse = {
  ticketNumber: string;
  emailSent: boolean;
  inquiry: {
    id: string;
    ticketNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    createdAt: string;
  };
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function submitInquiry(
  payload: SubmitInquiryPayload,
): Promise<SubmitInquiryResponse> {
  const res = await fetch(getApiUrl("/api/inquiries"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<SubmitInquiryResponse> & {
    message?: string;
  };

  if (!res.ok || !json.success || !json.data) {
    throw new Error(
      typeof json.message === "string" ? json.message : "Failed to submit inquiry",
    );
  }

  if (!json.data.emailSent) {
    throw new Error(
      typeof json.message === "string"
        ? json.message
        : "Inquiry saved but notification email could not be sent. Please try again later.",
    );
  }

  return json.data;
}
