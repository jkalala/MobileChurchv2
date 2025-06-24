// Mock Supabase client for build compatibility
export function createClient() {
  // During build, return a mock client
  if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
        delete: () => ({ eq: async () => ({ data: null, error: null }) }),
      }),
    }
  }

  // For development, return a more complete mock
  return {
    auth: {
      getSession: async () => ({
        data: {
          session: {
            user: {
              id: "dev-user-123",
              email: "dev@example.com",
              created_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
              role: "authenticated",
              app_metadata: { provider: "email" },
            },
            access_token: "dev-token-123",
            expires_at: Date.now() + 3600000,
          },
        },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Call callback with mock session
        setTimeout(() => {
          callback("SIGNED_IN", {
            user: {
              id: "dev-user-123",
              email: "dev@example.com",
              created_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
              role: "authenticated",
              app_metadata: { provider: "email" },
            },
          })
        }, 100)

        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }
      },
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({
            data: {
              id: "mock-id-123",
              user_id: "dev-user-123",
              first_name: "Dev",
              last_name: "User",
              email: "dev@example.com",
              phone: null,
              church_name: "Dev Church",
              role: "member",
              profile_image: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            error: null,
          }),
        }),
      }),
      insert: (data: any) => ({
        select: (columns?: string) => ({
          single: async () => ({
            data: { ...data, id: "new-mock-id" },
            error: null,
          }),
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns?: string) => ({
            single: async () => ({
              data: { ...data, id: "updated-mock-id" },
              error: null,
            }),
          }),
        }),
      }),
      delete: () => ({
        eq: async (column: string, value: any) => ({
          data: null,
          error: null,
        }),
      }),
    }),
  }
}

// 👇 ADD THESE LINES right after the createClient() definition
export const supabase = createClient()

export function getAuthenticatedClient() {
  return createClient()
}

export default supabase
