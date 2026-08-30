import Navbar from './Navbar.jsx';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;