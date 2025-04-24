import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Gráfico de barras para productos más vendidos
export const TopProductsChart = ({ data }: { data: { nombre: string; cantidad: number }[] }) => (
  <BarChart width={500} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="nombre" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="cantidad" fill="#8884d8" />
  </BarChart>
);

// Gráfico de líneas para comparación de ventas por período
export const SalesComparisonChart = ({ data }: { data: { periodo: string; total_venta: number }[] }) => (
  <LineChart width={500} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="periodo" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="total_venta" stroke="#82ca9d" />
  </LineChart>
);

// Gráfico de pastel para volumen de ventas por categoría
export const SalesByCategoryChart = ({ data }: { data: { categoria: string; total_venta: number }[] }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={({ categoria, total_venta }) => `${categoria}: $${total_venta}`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="total_venta"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};



// Gráfico de barras para margen de ganancia por producto
export const MarginByProductChart = ({ data }: { data: { nombre: string; margen_ganancia: string }[] }) => {
    // Convertir margen_ganancia de string a número
    const formattedData = data.map(item => ({
      ...item,
      margen_ganancia: parseFloat(item.margen_ganancia), // convertir string a número
    }));
  
    return (
      <BarChart width={500} height={300} data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="margen_ganancia" fill="#8884d8" />
      </BarChart>
    );
  };
  

// Gráfico de líneas para comparación de ganancias por período
export const EarningsComparisonChart = ({ data }: { data: { periodo: string; ganancia_total: string }[] }) => {
    const formattedData = data.map(item => ({
      ...item,
      ganancia_total: parseFloat(item.ganancia_total), 
      periodo: new Date(item.periodo).toLocaleDateString('es-ES'), 
    }));
  
    return (
      <LineChart width={500} height={300} data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="periodo" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ganancia_total" stroke="#82ca9d" />
      </LineChart>
    );
  };

// Gráfico de pastel para ganancias por categoría
export const EarningsByCategoryChart = ({ data }: { data: { categoria: string; ganancia_por_categoria: string }[] }) => {
    // Convertir ganancia_por_categoria de string a número
    const formattedData = data.map(item => ({
      ...item,
      ganancia_por_categoria: parseFloat(item.ganancia_por_categoria), // convertir string a número
    }));
  
    return (
      <BarChart width={500} height={300} data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="categoria" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="ganancia_por_categoria" fill="#8884d8" />
      </BarChart>
    );
  };
  