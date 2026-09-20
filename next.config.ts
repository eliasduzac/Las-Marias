import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Se desactiva en local para que no moleste
});

export default withPWA({
  // Acá podés dejar otras configuraciones de Next si ya tenías
});