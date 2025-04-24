import React, { useState } from 'react';
import { EarningsReport } from '../types/report.types';
import { MarginByProductChart, EarningsComparisonChart, EarningsByCategoryChart } from './ReportCharts';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

interface EarningsReportProps {
  earningsReport: EarningsReport;
}

export const EarningsReports: React.FC<EarningsReportProps> = ({ earningsReport }) => {
    const [selectedReport, setSelectedReport] = useState<string | null>(null);

    const handleCardClick = (reportType: string) => {
        setSelectedReport(prevReport => (prevReport === reportType ? null : reportType));
    };

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Reporte de Ganancias</h2>
            <div className="grid grid-cols-1 gap-4">
                <Card
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCardClick('marginByProduct')}
                >
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-yellow-500" />
                        <h3 className="text-xl font-semibold">Margen de ganancia por producto</h3>
                    </div>
                    {selectedReport === 'marginByProduct' && (
                        <div className="flex justify-center">
                            <MarginByProductChart data={earningsReport.margen_ganancia} />
                        </div>
                    )}
                </Card>
                <Card
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCardClick('earningsComparison')}
                >
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-red-500" />
                        <h3 className="text-xl font-semibold">Comparación de ganancias por período</h3>
                    </div>
                    {selectedReport === 'earningsComparison' && (
                        <div className="flex justify-center">
                            <EarningsComparisonChart data={earningsReport.ganancias_por_periodo} />
                        </div>
                    )}
                </Card>
                <Card
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCardClick('earningsByCategory')}
                >
                    <div className="flex items-center gap-2">
                        <PieChartIcon className="h-6 w-6 text-green-500" />
                        <h3 className="text-xl font-semibold">Ganancias netas por categoría</h3>
                    </div>
                    {selectedReport === 'earningsByCategory' && (
                        <div className="flex justify-center">
                            <EarningsByCategoryChart data={earningsReport.ganancias_por_categoria} />
                        </div>
                    )}
                </Card>
            </div>
        </Card>
    );
};

export default EarningsReports;