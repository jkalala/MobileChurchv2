import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import MobileNavigation from "../app/components/mobile-navigation"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock next/navigation
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/dashboard",
}))

// Mock language context
jest.mock("../lib/i18n", () => ({
  useLanguage: () => ({
    language: "pt",
    t: (key: string) => {
      const translations: Record<string, string> = {
        "nav.dashboard": "Painel",
        "nav.members": "Membros",
        "nav.events": "Eventos",
        "nav.financial": "Financeiro",
        "nav.more": "Mais",
      }
      return translations[key] || key
    },
  }),
}))

describe("Mobile Navigation", () => {
  it("renders all navigation items", () => {
    render(<MobileNavigation />)

    expect(screen.getByText("Painel")).toBeInTheDocument()
    expect(screen.getByText("Membros")).toBeInTheDocument()
    expect(screen.getByText("Eventos")).toBeInTheDocument()
    expect(screen.getByText("Financeiro")).toBeInTheDocument()
    expect(screen.getByText("Mais")).toBeInTheDocument()
  })

  it("highlights the active navigation item", () => {
    render(<MobileNavigation />)

    const dashboardItem = screen.getByText("Painel").closest("button")
    expect(dashboardItem).toHaveClass("text-blue-600") // Active state
  })

  it("navigates when navigation item is clicked", () => {
    render(<MobileNavigation />)

    const membersButton = screen.getByText("Membros").closest("button")
    fireEvent.click(membersButton!)

    expect(mockPush).toHaveBeenCalledWith("/dashboard/members")
  })
})
