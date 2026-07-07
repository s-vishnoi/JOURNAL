function getReadableAuthErrorMessage(error) {
  const message = String(
    error?.message || error?.error_description || error?.error || ''
  ).trim()

  if (!message) {
    return 'Authentication failed. Please try again.'
  }

  const normalized = message.toLowerCase()

  if (normalized.includes('email not confirmed') || normalized.includes('confirm your email')) {
    return 'Please confirm your email before signing in. We can resend the confirmation email if needed.'
  }

  if (normalized.includes('invalid login credentials') || normalized.includes('invalid credentials') || normalized.includes('invalid_grant')) {
    return 'The email or password is incorrect.'
  }

  if (normalized.includes('signups not allowed') || normalized.includes('signup is disabled')) {
    return 'Email sign-up is disabled for this project. Please enable it in Supabase.'
  }

  if (normalized.includes('email address is invalid')) {
    return 'Please enter a valid email address.'
  }

  if (normalized.includes('password') && normalized.includes('at least')) {
    return 'Please use a stronger password with at least 6 characters.'
  }

  return message
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getReadableAuthErrorMessage }
}
