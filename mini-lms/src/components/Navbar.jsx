function Navbar({ user, setUser }) {
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-xl font-bold">MiniLMS</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">{user.name}</span>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;