import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <Sidebar />
      <main className="ml-60 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;