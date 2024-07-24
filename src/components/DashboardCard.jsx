import PropTypes from 'prop-types';

const DashboardCard = ({ title, icon, value, color }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className={`text-3xl ${color} mb-2`}>
        <i className={`fa ${icon}`}></i>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-gray-500">{title}</div>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default DashboardCard;
