import bcrypt from 'bcrypt';
import { db } from '@/db';
import { usuarios } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const criarUsuario = async ({ email, senha }: { email: string, senha: string }) => {
  const hashedPassword = await bcrypt.hash(senha, 10);
  await db.insert(usuarios).values({ email, senha: hashedPassword });
};

export const loginUsuario = async ({ email, senha}: { email: string, senha: string}) => {
  const users = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, email));
  
  const user = users[0];
  

  if (user && user.senha) {
    const match = await bcrypt.compare(senha, user.senha);
    if (match) {
      return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    }
  }

  return null;
};

export const verificarToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload; 
    return decoded;
  } catch (error) {
    return null;
  }
};