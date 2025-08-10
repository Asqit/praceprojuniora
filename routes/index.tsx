import { Footer } from "../components/footer/footer.tsx";
import { Navbar } from "../components/navbar/navbar.tsx";
import App from "../islands/app/index.tsx";

export default function RootPage() {
  return (
    <>
      <Navbar />
      <App />
      <Footer />
    </>
  );
}
