

import Sidebar from '../../components/payment/Sidebar';
import MainContent from '../../components/payment/MainContent';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Dashboard;
