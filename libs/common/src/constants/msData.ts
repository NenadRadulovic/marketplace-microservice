export interface EmailData {
  toEmail: string;
  firstName: string;
  lastName: string;
  template: string;
  subject: string;
  context: EmailContext;
}

export interface StripeData {
  stripeId: string;
}

export interface EmailContext {
  firstName?: string;
  lastName?: string;
}
