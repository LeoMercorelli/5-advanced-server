// Convierte un objeto de usuario de base de datos en un DTO simplificado
export function toUsuarioActualDTO(user) {
  if (!user) return null;

  // Si es un documento de mongoose, lo transforma a objeto plano
  const u = user.toObject ? user.toObject() : user;

  // Devuelve solo los campos necesarios para exponer al cliente
  return {
    id: u._id?.toString?.() ?? u._id, // asegura que sea string
    first_name: u.first_name,
    last_name: u.last_name,
    email: u.email,
    age: u.age,
    role: u.role,
    cart: u.cart ?? null // en caso de no tener carrito devuelve null
  };
}
