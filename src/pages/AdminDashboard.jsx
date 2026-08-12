import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductModal from '../components/admin/ProductModal';
import CategoryModal from '../components/admin/CategoryModal';
import UserModal from '../components/admin/UserModal';
import OrderModal from '../components/admin/OrderModal';
import { FiArrowLeft, FiDollarSign, FiShoppingBag, FiUsers, FiBox, FiFolder, FiClock, FiCheckCircle, FiXCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [stats, setStats] = useState({
    products: [],
    categories: [],
    orders: [],
    users: [],
    revenue: { totalRevenue: 0, totalOrders: 0 }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData, ordersData, usersData, revenueData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
        adminService.getAllOrders(),
        adminService.getAllUsers(),
        adminService.getLifetimeRevenue()
      ]);

      setStats({
        products: productsData,
        categories: categoriesData,
        orders: ordersData,
        users: usersData,
        revenue: revenueData
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenAddProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminService.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleSaveProduct = async (productData, id) => {
    try {
      if (id) {
        await adminService.updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        await adminService.createProduct(productData);
        toast.success('Product created successfully');
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save product');
    }
  };

  const handleOpenAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (categoryData, id) => {
    try {
      if (id) {
        await adminService.updateCategory(id, categoryData);
        toast.success('Category updated successfully');
      } else {
        await adminService.createCategory(categoryData);
        toast.success('Category created successfully');
      }
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await adminService.deleteCategory(id);
        toast.success('Category deleted successfully');
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleOpenEditUser = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (userData, id) => {
    try {
      await adminService.updateUser(id, userData);
      toast.success('User updated successfully');
      setIsUserModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(id);
        toast.success('User deleted successfully');
        fetchData();
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || 'Failed to delete user';
        toast.error(errorMessage);
      }
    }
  };

  const handleOpenEditOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = async (status, orderId) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      toast.success('Order status updated successfully');
      setIsOrderModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#11131A]">
        <LoadingSpinner />
      </div>
    );
  }

  const modules = [
    {
      id: 'overview',
      title: 'Dashboard Overview',
      description: 'View total revenue, recent orders, and overall statistics',
      team: 'Analytics & Reporting'
    },
    {
      id: 'add_product',
      title: 'Add Product',
      description: 'Create and manage new product listings with validation',
      team: 'Product Management'
    },
    {
      id: 'delete_product',
      title: 'Delete Product',
      description: 'Remove products from inventory system',
      team: 'Product Management'
    },
    {
      id: 'modify_user',
      title: 'Modify User',
      description: 'Update user details and manage roles',
      team: 'User Management'
    },
    {
      id: 'view_user',
      title: 'View User Details',
      description: 'Fetch and display details of a specific user',
      team: 'User Management'
    },

    {
      id: 'monthly_business',
      title: 'Monthly Business',
      description: 'View revenue metrics for specific months',
      team: 'Analytics'
    },
    {
      id: 'day_business',
      title: 'Day Business',
      description: 'Track daily revenue and transactions',
      team: 'Analytics'
    },
    {
      id: 'yearly_business',
      title: 'Yearly Business',
      description: 'Analyze annual revenue performance',
      team: 'Analytics'
    },
    {
      id: 'overall_business',
      title: 'Overall Business',
      description: 'View total revenue since inception',
      team: 'Analytics'
    }
  ];

  const renderHomeGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {modules.map((mod) => (
        <button 
          key={mod.id} 
          onClick={() => setActiveTab(mod.id)}
          className="bg-[#1A1F2E] border border-gray-800 rounded-[20px] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-[0_4px_20px_rgba(234,179,8,0.05)] transition-all relative overflow-hidden min-h-[160px] cursor-pointer hover:border-yellow-500/30 group"
        >
          <div className="bg-yellow-500/10 text-yellow-500 font-bold px-8 py-1.5 rounded-full mb-6 text-sm inline-block border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
            {mod.title}
          </div>
          <p className="text-gray-400 text-sm mb-4 font-medium leading-relaxed">
            {mod.description}
          </p>
          <div className="absolute bottom-4 left-6 text-gray-500 italic text-[11px] font-medium tracking-wide uppercase">
            Team: {mod.team}
          </div>
        </button>
      ))}
    </div>
  );

  const StatCard = ({ title, value, icon, iconColor, iconBg }) => (
    <div className="bg-[#1A1F2E] rounded-xl p-6 flex items-center gap-4 border border-gray-800 shadow-sm">
      <div className={`p-4 rounded-xl ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );

  const renderOverview = () => {
    const { products, categories, orders, users, revenue } = stats;
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={`₹${revenue.totalRevenue.toLocaleString()}`}
            icon={<FiDollarSign size={24} />} 
            iconColor="text-emerald-400" 
            iconBg="bg-emerald-400/10" 
          />
          <StatCard 
            title="Total Orders" 
            value={revenue.totalOrders} 
            icon={<FiShoppingBag size={24} />} 
            iconColor="text-blue-400" 
            iconBg="bg-blue-400/10" 
          />
          <StatCard 
            title="Total Users" 
            value={users.length} 
            icon={<FiUsers size={24} />} 
            iconColor="text-purple-400" 
            iconBg="bg-purple-400/10" 
          />
          <StatCard 
            title="Pending Orders" 
            value={pendingOrders} 
            icon={<FiClock size={24} />} 
            iconColor="text-orange-400" 
            iconBg="bg-orange-400/10" 
          />
        </div>
      </div>
    );
  };

  const TableHeader = ({ columns }) => (
    <thead className="bg-[#11131A] text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
      <tr>
        {columns.map((col, i) => (
          <th key={i} className="px-6 py-4 font-bold">{col}</th>
        ))}
      </tr>
    </thead>
  );

  const renderProducts = () => (
    <div className="bg-[#1A1F2E] border border-gray-800 rounded-2xl overflow-hidden animate-fadeIn shadow-lg">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1e2436]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><FiBox className="text-yellow-500" /> Manage Products</h2>
        {activeTab !== 'delete_product' && (
          <button onClick={handleOpenAddProduct} className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors">Add Product</button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <TableHeader columns={
            activeTab === 'add_product' 
              ? ['Product', 'Category', 'Price', 'Stock', 'Status']
              : ['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions']
          } />
          <tbody className="divide-y divide-gray-800">
            {stats.products.map(p => (
              <tr key={p.productId} className="hover:bg-white/5 transition-colors text-sm">
                <td className="px-6 py-4 text-gray-200 font-medium">{p.name}</td>
                <td className="px-6 py-4 text-gray-400">{p.categoryName || 'Uncategorized'}</td>
                <td className="px-6 py-4 text-gray-300">₹{p.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-400">{p.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${p.stock > 10 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {p.stock > 10 ? 'In Stock' : 'Low Stock'}
                  </span>
                </td>
                {activeTab !== 'add_product' && (
                  <td className="px-6 py-4 text-gray-400 flex gap-3">
                    <button onClick={() => handleOpenEditProduct(p)} className="hover:text-yellow-500 transition-colors"><FiEdit2 /></button>
                    <button onClick={() => handleDeleteProduct(p.productId)} className="hover:text-red-500 transition-colors"><FiTrash2 /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="bg-[#1A1F2E] border border-gray-800 rounded-2xl overflow-hidden animate-fadeIn shadow-lg">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1e2436]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><FiFolder className="text-yellow-500" /> Manage Categories</h2>
        <button onClick={handleOpenAddCategory} className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors">Add Category</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <TableHeader columns={['ID', 'Category Name', 'Description', 'Actions']} />
          <tbody className="divide-y divide-gray-800">
            {stats.categories.map(c => (
              <tr key={c.categoryId} className="hover:bg-white/5 transition-colors text-sm">
                <td className="px-6 py-4 text-gray-500 font-medium">#{c.categoryId}</td>
                <td className="px-6 py-4 text-yellow-500 font-medium">{c.name}</td>
                <td className="px-6 py-4 text-gray-400 truncate max-w-xs">{c.description || '-'}</td>
                <td className="px-6 py-4 text-gray-400 flex gap-3">
                  <button onClick={() => handleOpenEditCategory(c)} className="hover:text-yellow-500 transition-colors"><FiEdit2 /></button>
                  <button onClick={() => handleDeleteCategory(c.categoryId)} className="hover:text-red-500 transition-colors"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-[#1A1F2E] border border-gray-800 rounded-2xl overflow-hidden animate-fadeIn shadow-lg">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1e2436]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><FiUsers className="text-yellow-500" /> Manage Users</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <TableHeader columns={
            activeTab === 'view_user' 
              ? ['User ID', 'Username', 'Email', 'Role']
              : ['User ID', 'Username', 'Email', 'Role', 'Actions']
          } />
          <tbody className="divide-y divide-gray-800">
            {stats.users.map(u => (
              <tr key={u.userId} className="hover:bg-white/5 transition-colors text-sm">
                <td className="px-6 py-4 text-gray-500 font-medium">#{u.userId}</td>
                <td className="px-6 py-4 text-gray-200 font-medium">{u.username}</td>
                <td className="px-6 py-4 text-gray-400">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${u.role === 'ROLE_ADMIN' || u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {u.role.replace('ROLE_', '')}
                  </span>
                </td>
                {activeTab !== 'view_user' && (
                  <td className="px-6 py-4 text-gray-400 flex gap-3">
                    <button onClick={() => handleOpenEditUser(u)} className="hover:text-yellow-500 transition-colors"><FiEdit2 /></button>
                    <button onClick={() => handleDeleteUser(u.userId)} className="hover:text-red-500 transition-colors"><FiTrash2 /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-[#1A1F2E] border border-gray-800 rounded-2xl overflow-hidden animate-fadeIn shadow-lg">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1e2436]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><FiShoppingBag className="text-yellow-500" /> Manage Orders</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <TableHeader columns={['Order #', 'Customer', 'Amount', 'Status', 'Date', 'Actions']} />
          <tbody className="divide-y divide-gray-800">
            {stats.orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(o => (
              <tr key={o.orderId} className="hover:bg-white/5 transition-colors text-sm">
                <td className="px-6 py-4 text-yellow-500 font-medium text-xs">#{o.orderId.substring(0, 8)}...</td>
                <td className="px-6 py-4 text-gray-200 uppercase text-xs">{o.username}</td>
                <td className="px-6 py-4 text-gray-300 font-medium">₹{o.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider 
                    ${o.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 
                      o.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 
                      'bg-red-500/10 text-red-500'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-gray-400 flex gap-3">
                  <button onClick={() => handleOpenEditOrder(o)} className="hover:text-yellow-500 transition-colors"><FiEdit2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = (timeframe) => {
    let filteredOrders = stats.orders;
    const now = new Date();
    let title = "Overall Business Analytics";

    if (timeframe === 'day_business') {
      title = "Today's Business Analytics";
      filteredOrders = stats.orders.filter(o => {
        const d = new Date(o.createdAt);
        return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (timeframe === 'monthly_business') {
      title = "Monthly Business Analytics";
      filteredOrders = stats.orders.filter(o => {
        const d = new Date(o.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (timeframe === 'yearly_business') {
      title = "Yearly Business Analytics";
      filteredOrders = stats.orders.filter(o => {
        const d = new Date(o.createdAt);
        return d.getFullYear() === now.getFullYear();
      });
    }

    const totalRev = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrd = filteredOrders.length;
    const pendingOrd = filteredOrders.filter(o => o.status === 'PENDING').length;

    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="flex items-center justify-between bg-[#1A1F2E] p-6 rounded-2xl border border-gray-800 shadow-lg">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <span className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-lg font-bold text-sm border border-yellow-500/20">
            {filteredOrders.length} Orders Found
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Revenue in Period" 
            value={`₹${totalRev.toLocaleString()}`}
            icon={<FiDollarSign size={24} />} 
            iconColor="text-emerald-400" 
            iconBg="bg-emerald-400/10" 
          />
          <StatCard 
            title="Orders in Period" 
            value={totalOrd} 
            icon={<FiShoppingBag size={24} />} 
            iconColor="text-blue-400" 
            iconBg="bg-blue-400/10" 
          />
          <StatCard 
            title="Pending Orders" 
            value={pendingOrd} 
            icon={<FiClock size={24} />} 
            iconColor="text-yellow-400" 
            iconBg="bg-yellow-400/10" 
          />
        </div>
        
        <div className="bg-[#1A1F2E] border border-gray-800 rounded-2xl overflow-hidden animate-fadeIn shadow-lg">
          <div className="p-6 border-b border-gray-800 bg-[#1e2436]">
            <h3 className="text-lg font-bold text-white">Transactions for {title.replace(' Analytics', '')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <TableHeader columns={['Order #', 'Customer', 'Amount', 'Status', 'Date']} />
              <tbody className="divide-y divide-gray-800">
                {filteredOrders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(o => (
                  <tr key={o.orderId} className="hover:bg-white/5 transition-colors text-sm">
                    <td className="px-6 py-4 text-yellow-500 font-medium text-xs">#{o.orderId.substring(0, 8)}...</td>
                    <td className="px-6 py-4 text-gray-200 uppercase text-xs">{o.username}</td>
                    <td className="px-6 py-4 text-gray-300 font-medium">₹{o.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider 
                        ${o.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 
                          o.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 
                          'bg-red-500/10 text-red-500'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No transactions found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#11131A] flex flex-col font-sans selection:bg-yellow-500/30 text-white">
      {/* Header */}
      <header className="bg-[#1A1F2E] border-b border-gray-800 py-4 px-8 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
            <span className="text-xl font-bold text-yellow-500">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide leading-tight text-white">Audio Hub</h1>
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Admin Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-400 text-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Admin Session
          </span>
          <button 
            onClick={handleLogout}
            className="border border-red-500/50 text-red-400 px-4 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-[1200px] mx-auto w-full mt-4">
        {activeTab !== 'home' && (
          <button 
            onClick={() => setActiveTab('home')}
            className="mb-8 flex items-center gap-2 text-yellow-500 font-medium hover:text-yellow-400 transition-colors"
          >
            <FiArrowLeft /> Back to Admin Grid
          </button>
        )}

        {activeTab === 'home' && renderHomeGrid()}
        {activeTab === 'overview' && renderOverview()}
        {['add_product', 'delete_product'].includes(activeTab) && renderProducts()}
        {activeTab === 'categories' && renderCategories()}
        {['view_user', 'modify_user'].includes(activeTab) && renderUsers()}
        {activeTab === 'orders' && renderOrders()}
        {['monthly_business', 'day_business', 'yearly_business', 'overall_business'].includes(activeTab) && renderAnalytics(activeTab)}
      </main>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        categories={stats.categories}
      />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        category={selectedCategory}
      />
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleSaveOrder}
        order={selectedOrder}
      />

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 px-12 flex justify-between items-end mt-auto w-full bg-[#1A1F2E]">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Audio Hub</h2>
          <p className="text-xs text-gray-500 font-medium tracking-wide">Premium Audio Equipment Management</p>
        </div>
        <div className="flex gap-4 text-gray-400 text-xs font-medium mb-1">
          <a href="#" className="hover:text-white transition-colors">About Us</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
