import { VikunjaError, ListResponse } from "./types.js";

export class VikunjaApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "VikunjaApiError";
  }
}

export class VikunjaApiClient {
  constructor(
    private baseUrl: string,
    private token: string,
  ) {}

  hasToken(): boolean {
    return this.token.length > 0;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = (await response.json()) as VikunjaError;
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Failed to parse error response, use default message
      }

      throw new VikunjaApiError(response.status, errorMessage, response.status);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as T;
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }

  async getList<T>(path: string): Promise<ListResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = (await response.json()) as VikunjaError;
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Failed to parse error response
      }

      throw new VikunjaApiError(response.status, errorMessage, response.status);
    }

    const data = (await response.json()) as T[];
    const totalCount = response.headers.get("x-total-count") || "0";
    const link = response.headers.get("link") || undefined;

    return {
      data,
      headers: {
        "x-total-count": totalCount,
        link,
      },
    };
  }
}
