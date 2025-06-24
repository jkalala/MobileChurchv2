import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import LanguageSelector from "../app/components/language-selector"
import jest from "jest" // Import jest to declare the variable

const mockSetLanguage = jest.fn()

jest.mock("../lib/i18n", () => ({
  useLanguage: () => ({
    language: "pt",
    setLanguage: mockSetLanguage,
    t: (key: string) => key,
  }),
}))

describe("Language Selector", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders all language options", () => {
    render(<LanguageSelector />)

    // Check for flag emojis and language codes
    expect(screen.getByText("🇦🇴")).toBeInTheDocument() // Angola flag for Portuguese
    expect(screen.getByText("🇺🇸")).toBeInTheDocument() // US flag for English
    expect(screen.getByText("🇫🇷")).toBeInTheDocument() // French flag
  })

  it("highlights the current language", () => {
    render(<LanguageSelector />)

    const portugueseButton = screen.getByRole("button", { name: /🇦🇴/i })
    expect(portugueseButton).toHaveClass("bg-blue-100") // Active state styling
  })

  it("calls setLanguage when a language is selected", () => {
    render(<LanguageSelector />)

    const englishButton = screen.getByRole("button", { name: /🇺🇸/i })
    fireEvent.click(englishButton)

    expect(mockSetLanguage).toHaveBeenCalledWith("en")
  })

  it("calls setLanguage for French", () => {
    render(<LanguageSelector />)

    const frenchButton = screen.getByRole("button", { name: /🇫🇷/i })
    fireEvent.click(frenchButton)

    expect(mockSetLanguage).toHaveBeenCalledWith("fr")
  })
})
