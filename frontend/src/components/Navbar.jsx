"use client";

import { useContext, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Menu, Origami, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import Features from "./Features";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: '#features' },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const { user, clearUser, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthRedirect = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      navigate("/signup");
    }
  };

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  if (loading) return null;

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          {/* ---------- Logo ---------- */}
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <Origami className="h-8 w-auto text-blue-700" />
            </Link>
          </div>

          {/* ---------- Nav Links ---------- */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-md font-semibold text-gray-900 hover:underline-offset-4 hover:underline transition ease-linear duration-1000"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* ---------- Auth / Profile ---------- */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {!user ? (
              <button
                onClick={handleAuthRedirect}
                className="text-sm font-semibold text-gray-900 bg-gray-100 rounded border border-gray-900 px-4 py-2 cursor-pointer hover:bg-gray-200 transition"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-md transition">
                <img
                  src={
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&w=256&h=256&q=80"
                  }
                  alt="User"
                  className="h-9 w-9 rounded-full border border-gray-300"
                />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name || "User"}
                  </span>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <Link
                      to="/profile"
                      className="hover:text-indigo-600 transition"
                    >
                      View profile
                    </Link>
                    |
                    <button
                      onClick={handleLogout}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---------- Mobile Menu ---------- */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <Menu aria-hidden="true" className="size-6" />
            </button>
          </div>
        </nav>

        {/* ---------- Mobile Drawer ---------- */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <Origami className="h-8 w-auto text-blue-700" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <X aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>

                <div className="py-6">
                  {!user ? (
                    <button
                      onClick={handleAuthRedirect}
                      className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
                    >
                      Log in
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-2">
                      <img
                        src={
                          user?.avatar ||
                          "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&w=256&h=256&q=80"
                        }
                        alt="User"
                        className="h-10 w-10 rounded-full border border-gray-300"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {user?.name || "User"}
                        </span>
                        <div className="text-sm text-gray-500">
                          <Link
                            to="/profile"
                            className="hover:text-indigo-600 pb-5"
                          >
                            View profile
                          </Link>
                          <br/>
                          <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-600 border rounded-md px-1 py-0.5 "
                          >
                            Logout
                           </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
};

export default Navbar;
