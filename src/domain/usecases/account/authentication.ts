export type AuthenticationParams = {
  email: string
  password: string
}
export interface Authentication {
  auth: (authenticationData: AuthenticationParams) => Promise<string>
}
