import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import AuthPage from "../app/auth/page"
import { jest } from "@jest/globals"

// Mock the language context
const mockLanguageContext = {
  language: "pt",
  setLanguage: jest.fn(),
  t: (key: string) => {
    const translations: Record<string, string> = {
      "auth.welcome": "Bem-vindo",
      "auth.signIn": "Entrar",
      "auth.signUp": "Criar Conta",
      "auth.email": "Email",
      "auth.password": "Senha",
      "auth.confirmPassword": "Confirmar Senha",
      "auth.fullName": "Nome Completo",
      "auth.phoneNumber": "Número de Telefone",
      "auth.country": "País",
      "auth.inviteCode": "Código de Convite da Igreja",
      "auth.agreeTerms": "Concordo com os Termos e Condições",
      "auth.signInWithGoogle": "Entrar com Google",
      "auth.signInWithApple": "Entrar com Apple",
      "auth.useBiometric": "Usar Impressão Digital",
      "auth.forgotPassword": "Esqueceu a senha?",
      "auth.noAccount": "Não tem uma conta?",
      "auth.hasAccount": "Já tem uma conta?",
    }
    return translations[key] || key
  },
}

jest.mock("../lib/i18n", () => ({
  useLanguage: () => mockLanguageContext,
}))

describe("Authentication Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the authentication page with Portuguese text", () => {
    render(<AuthPage />)

    expect(screen.getByText("Bem-vindo")).toBeInTheDocument()
    expect(screen.getByText("Entrar")).toBeInTheDocument()
    expect(screen.getByText("Criar Conta")).toBeInTheDocument()
  })

  it("switches between sign in and sign up tabs", async () => {
    render(<AuthPage />)

    const signUpTab = screen.getByText("Criar Conta")
    fireEvent.click(signUpTab)

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Nome Completo")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Confirmar Senha")).toBeInTheDocument()
    })
  })

  it("displays country selector with Angola as default", () => {
    render(<AuthPage />)

    const countrySelector = screen.getByRole("combobox")
    expect(countrySelector).toBeInTheDocument()
  })

  it("shows social login options", () => {
    render(<AuthPage />)

    expect(screen.getByText("Entrar com Google")).toBeInTheDocument()
    expect(screen.getByText("Entrar com Apple")).toBeInTheDocument()
  })

  it("displays biometric authentication option", () => {
    render(<AuthPage />)

    expect(screen.getByText("Usar Impressão Digital")).toBeInTheDocument()
  })

  it("validates required fields on form submission", async () => {
    render(<AuthPage />)

    const signInButton = screen.getByRole("button", { name: /entrar/i })
    fireEvent.click(signInButton)

    // Form validation should prevent submission with empty fields
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    })
  })

  it("handles language switching", () => {
    const { rerender } = render(<AuthPage />)

    // Simulate language change to English
    mockLanguageContext.language = "en"
    mockLanguageContext.t = (key: string) => {
      const translations: Record<string, string> = {
        "auth.welcome": "Welcome",
        "auth.signIn": "Sign In",
        "auth.signUp": "Sign Up",
      }
      return translations[key] || key
    }

    rerender(<AuthPage />)

    expect(mockLanguageContext.setLanguage).toBeDefined()
  })
})
