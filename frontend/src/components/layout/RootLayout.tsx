import Header from "./Header";
import Footer from "./Footer";

interface LayoutRootProps {
  children: React.ReactNode;
}

const LayoutRoot = ({ children }: LayoutRootProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutRoot;
