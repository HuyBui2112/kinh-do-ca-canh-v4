import Header from "./Header";
import Footer from "./Footer";
import { UserProvider } from "../../contexts/UserContext";

interface LayoutRootProps {
  children: React.ReactNode;
}

const LayoutRoot = ({ children }: LayoutRootProps) => {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </UserProvider>
  );
};

export default LayoutRoot;
