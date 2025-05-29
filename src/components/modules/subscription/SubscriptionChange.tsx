import React from 'react';
import { CheckCircle, Crown, Stethoscope } from 'lucide-react';

const plans = [
	{
		name: 'Plan Básico',
		price: 29,
		icon: (
			<Stethoscope
				className="inline-block text-blue-500 mr-1"
				size={22}
			/>
		),
		features: [
			'Gestión de citas',
			'Historiales básicos',
			'Facturación electrónica',
			'Soporte por correo',
		],
		button: (
			<button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition">
				Seleccionar Plan
			</button>
		),
		border: 'border border-gray-200',
		highlight: false,
		disabled: false,
		bg: 'bg-white',
	},
	{
		name: 'Plan Estándar',
		price: 59,
		icon: <Crown className="inline-block text-teal-600 mr-1" size={22} />,
		features: [
			'Plan Básico, más:',
			'Gestión avanzada de citas',
			'Historiales detallados',
			'Gestión de inventario',
			'Soporte prioritario',
		],
		button: (
			<button className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-semibold mt-6 cursor-not-allowed">
				Plan Actual
			</button>
		),
		border: 'border-2 border-teal-400',
		highlight: true,
		disabled: true,
		badge: 'Más Popular',
		bg: 'bg-white',
	},
	{
		name: 'Plan Premium',
		price: 99,
		icon: <Crown className="inline-block text-purple-600 mr-1" size={22} />,
		features: [
			'Plan Estándar, más:',
			'Personalización',
			'Reportes avanzados',
			'Integración con sistemas',
			'Soporte 24/7',
		],
		button: (
			<button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition">
				Seleccionar Plan
			</button>
		),
		border: 'border border-gray-200',
		highlight: false,
		disabled: false,
		bg: 'bg-white',
	},
];

const SubscriptionChange: React.FC = () => (
	<div className="w-full flex flex-col items-center py-8 px-2 bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa] min-h-[80vh]">
		<h2 className="text-3xl font-bold text-[#005456] mb-8 text-center">
			Elige el plan que mejor se adapte a tu clínica
		</h2>
		<div className="w-full flex flex-col md:flex-row gap-8 justify-center">
			{plans.map((plan) => (
				<div
					key={plan.name}
					className={`relative flex-1 min-w-[320px] max-w-[400px] ${plan.bg} rounded-2xl p-8 ${plan.border} shadow-lg transition-transform hover:scale-105 ${
						plan.highlight
							? 'ring-2 ring-teal-400 ring-offset-2'
							: ''
					}`}
				>
					{plan.highlight && (
						<span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-teal-400 text-white text-xs px-5 py-1 rounded-full font-semibold shadow-lg z-10">
							{plan.badge}
						</span>
					)}
					<div className="flex items-center mb-3">
						{plan.icon}
						<span
							className={`text-2xl font-bold ${
								plan.highlight ? 'text-teal-700' : 'text-gray-800'
							}`}
						>
							{plan.name}
						</span>
					</div>
					<div className="mb-2 flex items-end gap-2">
						<span className="text-4xl font-extrabold text-[#005456]">
							${plan.price}
						</span>
						<span className="text-gray-400 text-lg">/mes</span>
					</div>
					<ul className="list-none space-y-2 mt-6 mb-4">
						{plan.features.map((feature, i) => (
							<li
								key={feature}
								className={`flex items-center text-base ${
									i === 0 && feature.endsWith(':')
										? 'font-semibold text-gray-700'
										: 'text-green-700'
								}`}
							>
								<CheckCircle
									className={`mr-2 h-5 w-5 ${
										i === 0 && feature.endsWith(':')
											? 'invisible'
											: 'text-green-500'
									}`}
								/>
								{feature}
							</li>
						))}
					</ul>
					{plan.name === 'Plan Básico' && (
						<div className="text-xs text-gray-500 mb-2">
							Anual:{' '}
							<span className="font-semibold">290 USD</span>{' '}
							<span className="text-green-600">(Ahorro del 17%)</span>
						</div>
					)}
					{plan.name === 'Plan Estándar' && (
						<div className="text-xs text-gray-500 mb-2">
							Anual:{' '}
							<span className="font-semibold">590 USD</span>{' '}
							<span className="text-green-600">(Ahorro del 17%)</span>
						</div>
					)}
					{plan.name === 'Plan Premium' && (
						<div className="text-xs text-gray-500 mb-2">
							Anual:{' '}
							<span className="font-semibold">990 USD</span>{' '}
							<span className="text-green-600">(Ahorro del 17%)</span>
						</div>
					)}
					{plan.button}
				</div>
			))}
		</div>
	</div>
);

export default SubscriptionChange;
