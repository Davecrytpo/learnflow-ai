import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Visit from "@/pages/admissions/Visit";
import Contact from "@/pages/admissions/Contact";

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderVisitFlow = (initialEntries = ["/admissions/visit"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/admissions/visit" element={<Visit />} />
        <Route path="/admissions/contact" element={<Contact />} />
        <Route path="/webinars" element={<div>Webinars</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("Campus visit flow", () => {
  it("navigates the primary campus visit actions into the admissions contact page", async () => {
    renderVisitFlow();

    fireEvent.click(screen.getByRole("link", { name: /book a guided tour/i }));
    expect(await screen.findByRole("heading", { name: /contact admissions/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Schedule a Tour")).toBeInTheDocument();
  });

  it("prefills the campus map inquiry from the secondary campus visit action", async () => {
    renderVisitFlow();
    fireEvent.click(screen.getByRole("link", { name: /request campus map/i }));
    expect(await screen.findByDisplayValue("Request Campus Map")).toBeInTheDocument();
  });

  it("routes each tour card learn-more action to a matching admissions subject", () => {
    renderVisitFlow();

    const links = screen.getAllByRole("link", { name: /learn more/i });

    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "/admissions/contact?subject=Guided%20Campus%20Tour");
    expect(links[1]).toHaveAttribute("href", "/admissions/contact?subject=Self-Guided%20Tour");
    expect(links[2]).toHaveAttribute("href", "/admissions/contact?subject=Virtual%20Reality%20Tour");
  });
});
