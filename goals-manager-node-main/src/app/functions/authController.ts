import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '@/db';
import { usuarios } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
  
  // Adicionando logs antes da comparação da senha
  console.log('Usuário encontrado:', user);
  console.log('Senha fornecida:', senha);

  if (user && user.senha) {
    console.log('Senha hashada armazenada:', user.senha);
    const match = await bcrypt.compare(senha, user.senha);
    console.log('A senha corresponde:', match); // Exibe se a senha fornecida corresponde ao hash

    if (match) {
      return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    }
  }


  
  return null;
};

