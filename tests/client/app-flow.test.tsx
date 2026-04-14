import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";

let fetchMock: ReturnType<typeof vi.fn>;

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(async () => null),
}));

vi.mock("motion/react", async () => {
  const ReactModule = await import("react");

  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        return ({ children, ...props }: Record<string, unknown>) =>
          ReactModule.createElement(tag, props, children);
      },
    },
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe("App waitlist flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    window.scrollTo = vi.fn();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState({}, "", "/");
  });

  it("shows the paid conversion state after a successful lead submission", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        email: "founder@example.com",
        paid: false,
        priorityAccess: false,
        message: "Lead captured",
      }),
    } as Response);

    render(<App />);

    const emailInputs = screen.getAllByPlaceholderText("you@vibecoding.com");
    fireEvent.change(emailInputs[emailInputs.length - 1], {
      target: { value: "founder@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /request early access/i }));

    expect(await screen.findByText(/Waitlist Confirmed!/i)).toBeInTheDocument();
  });

  it("stores the submitted email and respects priority state returned by the api", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        email: "founder@example.com",
        memberId: "VF-2026-AB12CD34",
        paid: true,
        priorityAccess: true,
        message: "Lead captured",
      }),
    } as Response);

    render(<App />);

    const emailInputs = screen.getAllByPlaceholderText("you@vibecoding.com");
    fireEvent.change(emailInputs[emailInputs.length - 1], {
      target: { value: "founder@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /request early access/i }));

    await waitFor(() => {
      expect(localStorage.getItem("vibefello_email")).toBe("founder@example.com");
      expect(localStorage.getItem("vibefello_member")).toBe("true");
      expect(localStorage.getItem("vibefello_member_id")).toBe("VF-2026-AB12CD34");
    });

    expect(await screen.findByText(/MEMBERSHIP ACTIVE/i)).toBeInTheDocument();
    expect(screen.getByText("VF-2026-AB12CD34")).toBeInTheDocument();
  });

  it("loads the persisted member id after Stripe redirects back with a checkout session id", async () => {
    localStorage.setItem("vibefello_email", "founder@example.com");
    localStorage.setItem("vibefello_member", "true");
    window.history.replaceState({}, "", "/?payment=success&session_id=cs_live_member_123");

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        email: "founder@example.com",
        memberId: "VF-2026-AB12CD34",
        paid: true,
        priorityAccess: true,
      }),
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/member-status?session_id=cs_live_member_123");
    });
    expect((await screen.findAllByText("VF-2026-AB12CD34")).length).toBeGreaterThan(0);
  });
});
