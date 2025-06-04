import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import {
    Lot,
    getLots,
    createLot,
    updateLot,
    deleteLot
} from "../../../services/products/lotService";
import {
    Empresa,
    getEmpresas
} from "../../../services/products/companyService";
import {
    Inventory,
    getInventories
} from "../../../services/products/inventoryService";
import {
    Supplier,
    getSuppliers
} from "../../../services/products/suplierService";
import { showToast } from "../../../components/shared/Toast";
import { useNavigate } from "react-router-dom";

export function LotsModule() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLot, setCurrentLot] = useState<Lot | null>(null);
    const [lots, setLots] = useState<Lot[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [productos, setProductos] = useState<Inventory[]>([]);
    const [proveedores, setProveedores] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empData, prodData, provData, lotData] = await Promise.all([
                    getEmpresas(),
                    getInventories(),
                    getSuppliers(),
                    getLots()
                ]);

                console.log("Empresas cargadas:", empData);
                console.log("Productos cargados:", prodData);
                console.log("Proveedores cargados:", provData);
                console.log("Lotes cargados:", lotData);

                lotData.forEach((lot, index) => {
                    console.log(`Lote ${index + 1} - Estado:`, lot.estado);
                });

                setEmpresas(empData);
                setProductos(prodData);
                setProveedores(provData);
                setLots(lotData);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    showToast.error("Sesión expirada. Inicie sesión nuevamente.");
                    navigate("/login");
                } else {
                    showToast.error("Error al cargar lotes, productos, proveedores o empresas.");
                    console.error("Error details:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const lotFields: Field[] = [
        {
            name: "codigo_lote",
            label: "Código del Lote",
            type: "text",
            required: true
        },
        {
            name: "fecha_entrada",
            label: "Fecha de Entrada",
            type: "date",
            required: true
        },
        {
            name: "fecha_venc",
            label: "Fecha de Vencimiento",
            type: "date",
            required: true
        },
        {
            name: "stock_actual",
            label: "Stock Actual",
            type: "number",
            required: true
        },
        {
            name: "estado",
            label: "Estado",
            type: "select",
            required: true,
            options: [
                { label: "Disponible", value: "Disponible" },
                { label: "No Disponible", value: "No Disponible" },
                { label: "Moderado", value: "Moderado" }
            ]
        },
        {
            name: "id_producto",
            label: "Producto",
            type: "select",
            required: true,
            options: productos.map(prod => ({
                label: prod.nombre,
                value: prod.id || ""
            }))
        },
        {
            name: "id_proveedor",
            label: "Proveedor",
            type: "select",
            required: true,
            options: proveedores.map(prov => ({
                label: prov.nombre,
                value: prov.id || ""
            }))
        },
        {
            name: "id_empresa",
            label: "Empresa",
            type: "select",
            required: true,
            options: empresas.map(emp => ({
                label: emp.nombre,
                value: emp.id || ""
            }))
        }
    ];

    const handleCreate = () => {
        setCurrentLot(null);
        setIsModalOpen(true);
    };

    const handleEdit = (lot: Lot) => {
        if (!lot.id) {
            showToast.error("Lote inválido para editar");
            return;
        }
        console.log("Editando lote:", lot);
        setCurrentLot(lot);
        setIsModalOpen(true);
    };

    // Función para formatear fecha a YYYY-MM-DD para inputs date
    const formatDateForInput = (dateString: string): string => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            // Verificar si la fecha es válida
            if (isNaN(date.getTime())) return '';

            // Obtener la fecha en formato YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error("Error formateando fecha:", error);
            return '';
        }
    };

    const handleSubmit = async (formData: Record<string, any>) => {
        try {
            console.log("Datos del formulario recibidos:", formData);

            // AGREGAR ESTE LOG PARA DEPURAR
            console.log("Estado seleccionado:", formData.estado);

            // Validar campos requeridos
            const requiredFields = [
                'codigo_lote', 'fecha_entrada', 'fecha_venc',
                'stock_actual', 'estado', 'id_producto',
                'id_proveedor', 'id_empresa'
            ];

            for (const field of requiredFields) {
                if (!formData[field]) {
                    throw new Error(`El campo ${field} es requerido`);
                }
            }

            // Validar que las fechas sean válidas
            const fechaEntrada = new Date(formData.fecha_entrada);
            const fechaVenc = new Date(formData.fecha_venc);

            if (isNaN(fechaEntrada.getTime())) {
                throw new Error("La fecha de entrada no es válida");
            }

            if (isNaN(fechaVenc.getTime())) {
                throw new Error("La fecha de vencimiento no es válida");
            }

            if (fechaVenc <= fechaEntrada) {
                throw new Error("La fecha de vencimiento debe ser posterior a la fecha de entrada");
            }

            const payload = {
                codigo_lote: formData.codigo_lote.trim(),
                fecha_entrada: formData.fecha_entrada,
                fecha_venc: formData.fecha_venc,
                stock_actual: parseInt(formData.stock_actual),
                estado: formData.estado,
                id_producto: formData.id_producto,
                id_proveedor: formData.id_proveedor,
                id_empresa: formData.id_empresa
            };

            console.log("Payload preparado:", payload);

            if (currentLot?.id) {
                const updated = await updateLot(currentLot.id, payload);
                setLots(lots.map(lot =>
                    lot.id === currentLot.id ? updated : lot
                ));
                showToast.success("Lote actualizado correctamente");
            } else {
                const created = await createLot(payload);
                setLots([...lots, created]);
                showToast.success("Lote creado correctamente");
            }

            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Error completo:", error);

            let errorMessage = "Error al guardar lote";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }

            showToast.error(errorMessage);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteLot(id);
            setLots(lots.filter(lot => lot.id !== id));
            showToast.success("Lote eliminado correctamente");
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || "Error al eliminar lote";
            showToast.error(msg);
        }
    };

    // Función para formatear fechas en la tabla
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('es-ES');
        } catch (error) {
            return 'N/A';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-gray-500">Cargando Lotes...</p>
            </div>
        );
    }

    return (
        <div className="px-4 pt-1 pb-4">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold text-gray-800 -mt-2">Lotes</h2>
                <PrimaryButton icon={Plus} onClick={handleCreate}>
                    Nuevo Lote
                </PrimaryButton>
            </div>

            <DataTable
                fields={[
                    { name: 'codigo_lote', label: 'Código' },
                    {
                        name: 'fecha_entrada',
                        label: 'F. Entrada',
                        render: (value: string) => formatDate(value)
                    },
                    {
                        name: 'fecha_venc',
                        label: 'F. Vencimiento',
                        render: (value: string) => formatDate(value)
                    },
                    { name: 'stock_actual', label: 'Stock' },
                    {
                        name: 'estado',
                        label: 'Estado',
                        render: (value: string) => {
                            const statusColors = {
                                'Disponible': 'text-green-600 bg-green-100',      // Verde
                                'No Disponible': 'text-red-600 bg-red-100',       // Rojo  
                                'Moderado': 'text-yellow-600 bg-yellow-100'       // Amarillo
                            } as const;

                            const colorClass = statusColors[value as keyof typeof statusColors] || 'text-gray-600 bg-gray-100';

                            return (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                                    {value}
                                </span>
                            );
                        }
                    },
                    {
                        name: 'id_producto',
                        label: 'Producto',
                        render: (value: string | { id: string; nombre?: string }) => {
                            if (!value) return 'N/A';

                            if (typeof value === 'object') {
                                return value.nombre || 'Producto no encontrado';
                            }

                            const producto = productos.find(prod => prod.id === value);
                            return producto?.nombre || 'Producto no encontrado';
                        }
                    },
                    {
                        name: 'id_proveedor',
                        label: 'Proveedor',
                        render: (value: string | { id: string; nombre?: string }) => {
                            if (!value) return 'N/A';

                            if (typeof value === 'object') {
                                return value.nombre || 'Proveedor no encontrado';
                            }

                            const proveedor = proveedores.find(prov => prov.id === value);
                            return proveedor?.nombre || 'Proveedor no encontrado';
                        }
                    }
                ]}
                initialData={lots}
                onEdit={handleEdit}
                onDelete={handleDelete}
                className="mt-1"
            />

            <CrudModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentLot ? "Editar Lote" : "Nuevo Lote"}
                fields={lotFields}
                initialData={
                    currentLot
                        ? {
                            ...currentLot,
                            id_producto: typeof currentLot.id_producto === 'object'
                                ? currentLot.id_producto.id
                                : currentLot.id_producto,
                            id_proveedor: typeof currentLot.id_proveedor === 'object'
                                ? currentLot.id_proveedor.id
                                : currentLot.id_proveedor,
                            id_empresa: typeof currentLot.id_empresa === 'object'
                                ? currentLot.id_empresa.id
                                : currentLot.id_empresa,
                            // Formatear fechas para el input date usando la nueva función
                            fecha_entrada: formatDateForInput(currentLot.fecha_entrada),
                            fecha_venc: formatDateForInput(currentLot.fecha_venc)
                        }
                        : {}
                }
                onSubmit={handleSubmit}
                onDelete={currentLot ? () => currentLot.id && handleDelete(currentLot.id) : undefined}
                isEditing={!!currentLot}
            />
        </div>
    );
}