import React from 'react';
import { FaRegCreditCard, FaCheckCircle, FaDownload } from 'react-icons/fa';

const mockPayments = [
	{
		id: 1,
		invoice: 'FAC-2024-001',
		date: '14/12/2023',
		plan: 'Plan Profesional',
		method: 'Tarjeta de crédito/débito',
		amount: '$49.99 USD',
		status: 'Pagado',
	},
	{
		id: 2,
		invoice: 'FAC-2023-012',
		date: '14/11/2023',
		plan: 'Plan Profesional',
		method: 'Tarjeta de crédito/débito',
		amount: '$49.99 USD',
		status: 'Pagado',
	},
	{
		id: 3,
		invoice: 'FAC-2023-011',
		date: '14/10/2023',
		plan: 'Plan Profesional',
		method: 'Tarjeta de crédito/débito',
		amount: '$49.99 USD',
		status: 'Pagado',
	},
	{
		id: 4,
		invoice: 'FAC-2023-010',
		date: '14/9/2023',
		plan: 'Plan Básico',
		method: 'Tarjeta de crédito/débito',
		amount: '$19.99 USD',
		status: 'Pagado',
	},
	{
		id: 5,
		invoice: 'FAC-2023-009',
		date: '14/8/2023',
		plan: 'Plan Básico',
		method: 'Tarjeta de crédito/débito',
		amount: '$19.99 USD',
		status: 'Pagado',
	},
];

const SubscriptionHistory: React.FC = () => (
	<div>
		<div className="flex items-center mb-6 gap-3">
			<FaRegCreditCard className="text-blue-500 text-3xl" />
			<h1 className="text-3xl font-extrabold text-blue-700">Historial de Pagos</h1>
		</div>
		<p className="mb-8 text-gray-600 text-lg">Todas tus facturas y pagos del servicio</p>
		<div className="overflow-x-auto rounded-lg shadow">
			<table className="min-w-full bg-white">
				<thead>
					<tr className="bg-blue-100 text-blue-700">
						<th className="py-3 px-4 text-left font-semibold">Factura</th>
						<th className="py-3 px-4 text-left font-semibold">Fecha</th>
						<th className="py-3 px-4 text-left font-semibold">Plan</th>
						<th className="py-3 px-4 text-left font-semibold">Método</th>
						<th className="py-3 px-4 text-left font-semibold">Monto</th>
						<th className="py-3 px-4 text-left font-semibold">Estado</th>
						<th className="py-3 px-4 text-left font-semibold">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{mockPayments.map((payment) => (
						<tr key={payment.id} className="hover:bg-blue-50 transition-colors">
							<td className="py-3 px-4">{payment.invoice}</td>
							<td className="py-3 px-4">{payment.date}</td>
							<td className="py-3 px-4">{payment.plan}</td>
							<td className="py-3 px-4 flex items-center gap-2">
								<FaRegCreditCard className="text-blue-400" />
								<span>{payment.method}</span>
							</td>
							<td className="py-3 px-4 font-bold text-green-600">{payment.amount}</td>
							<td className="py-3 px-4">
								<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
									<FaCheckCircle className="text-green-500" /> {payment.status}
								</span>
							</td>
							<td className="py-3 px-4 text-center">
								<button className="hover:text-blue-600" title="Descargar factura">
									<FaDownload />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</div>
);

export default SubscriptionHistory;
