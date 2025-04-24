import React from 'react';
import { useReports } from '../hooks/useReports';
import SalesReport from '../components/SalesReport';
import EarningsReport from '../components/EarningsReport';

const ReportsPage: React.FC = () => {
  const {
    salesReport,
    earningsReport,
    isSalesLoading,
    isEarningsLoading,
    isSalesError,
    isEarningsError,
  } = useReports();

  if (isSalesLoading || isEarningsLoading) {
    return <div>Cargando reportes...</div>;
  }

  if (isSalesError || isEarningsError) {
    return <div>Error al cargar los reportes.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reportes</h1>
      <SalesReport salesReport={salesReport} />
      {earningsReport && <EarningsReport earningsReport={earningsReport} />}
    </div>
  );
};

export default ReportsPage;