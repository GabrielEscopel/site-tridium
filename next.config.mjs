/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /* A pasta de saída é a PADRÃO (.next). Qualquer serviço de hospedagem
     procura por ela com esse nome — foi o que quebrou a implantação na
     Hostinger quando isto apontava para ".next-build".

     Para compilar localmente sem derrubar o `npm run dev` que estiver no ar,
     use `npm run build:local`: ele grava em .next-build via variável própria,
     que só existe na sua máquina e nunca chega ao servidor. */
  distDir: process.env.TRIDIUM_DIST_DIR || ".next",

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920, 2400],
  },
};

export default nextConfig;
