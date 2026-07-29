export function FieldError({ error }: { error?: string | string[] | null }) {
  if (!error) return null;
  const messages = Array.isArray(error) ? error : [error];
  return messages.map((msg, i) => (
    <p key={i} className="mt-1 text-xs text-red-600" role="alert">
      {msg}
    </p>
  ));
}
