export function generateId(length: number = 12): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // Primeros 3 caracteres → mayúsculas
  let id = '';
  for (let i = 0; i < 3; i++) {
    id += upper.charAt(Math.floor(Math.random() * upper.length));
  }

  // Separador
  id += '_';

  // El resto (length = total final, incluyendo los 4 primeros)
  const remaining = length - id.length;
  for (let i = 0; i < remaining; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return id;
}
