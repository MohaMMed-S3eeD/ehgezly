import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import React from "react";
import { LogoutAction } from "../(auth)/_actions/auth.action";

const page = async () => {
  const session = await auth();
  
  // Get complete data from database
  const user = session?.user?.id ? await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookings: true,
      services: true,
    }
  }) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {session?.user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-lg font-semibold text-gray-900">{session?.user?.name || "Not available"}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-lg font-semibold text-gray-900">{session?.user?.email || "Not available"}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  session?.user?.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                  session?.user?.role === 'PROVIDER' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {session?.user?.role === 'ADMIN' ? 'Admin' :
                   session?.user?.role === 'PROVIDER' ? 'Provider' :
                   'Customer'}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-lg font-semibold text-gray-900">{user?.createdAt?.toLocaleDateString() || 'Not available'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Bookings</h3>
                    <p className="text-blue-100">Total bookings</p>
                  </div>
                  <div className="text-3xl font-bold">{user?.bookings?.length || 0}</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Services</h3>
                    <p className="text-green-100">Available services</p>
                  </div>
                  <div className="text-3xl font-bold">{user?.services?.length || 0}</div>
                </div>
                  <div className="text-xl ">{user?.services?.map((service) => service.title)}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <form action={LogoutAction} className="flex justify-center">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
