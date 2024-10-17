CREATE TABLE IF NOT EXISTS "usuarios" (
    "id" TEXT PRIMARY KEY,
    "nome" TEXT,
    "email" TEXT,
    "senha" TEXT,
    "criadoEm" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "metas" (
    "id" TEXT PRIMARY KEY,
    "titulo" TEXT,
    "frequenciaSemanalDesejada" INTEGER,
    "criadaEm" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "usuario_id" TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS "metasCompletas" (
    "id" TEXT PRIMARY KEY,
    "meta_id" TEXT,
    "completadaEm" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    FOREIGN KEY (meta_id) REFERENCES metas(id)
);
