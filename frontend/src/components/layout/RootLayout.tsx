import Header from "./Header";
import Footer from "./Footer";
import { UserProvider } from "../../contexts/UserContext";
import ToastProvider from "@/contexts/ToastContext";

interface LayoutRootProps {
  children: React.ReactNode;
}

const LayoutRoot = ({ children }: LayoutRootProps) => {
  return (
    <UserProvider>
      <ToastProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </ToastProvider>
    </UserProvider>
  );
};

export default LayoutRoot;
