/** Logged-in user id from login response (required for created_by / approved_by). */
export function getStoredUserId(): number | undefined {
  const raw = localStorage.getItem('user_id');
  if (!raw) return undefined;
  const id = Number.parseInt(raw, 10);
  return Number.isFinite(id) ? id : undefined;
}
