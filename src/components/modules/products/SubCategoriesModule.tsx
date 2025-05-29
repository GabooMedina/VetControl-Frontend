import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import {
    Subcategory,
    getSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory
} from "../../../services/products/subcategoriesService";
import { getCategories, Category } from "../../../services/products/categoriesService";
import { showToast } from "../../../components/shared/Toast";
import { useNavigate } from "react-router-dom";

export function SubCategoriesModule() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subData, catData] = await Promise.all([
                    getSubcategories(),
                    getCategories()
                ]);
                setSubcategories(subData);
                setCategories(catData);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
                    navigate("/login");
                } else {
                    showToast.error("Error al cargar subcategorías o categorías.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const subcategoryFields: Field[] = [
        {
            name: "nombre",
            label: "Nombre de la Subcategoría",
            type: "text",
            required: true
        },
        {
            name: "id_categoria",
            label: "Categoría",
            type: "select",
            required: true,
            options: categories.map(cat => ({
                label: cat.nombre,
                value: cat.id || ""
            }))
        }
    ];

    const handleCreate = () => {
        setCurrentSubcategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (sub: Subcategory) => {
        if (!sub.id) {
            showToast.error("Subcategoría inválida para editar");
            return;
        }
        setCurrentSubcategory(sub);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData: Record<string, any>) => {
        try {
            if (!formData.nombre || !formData.id_categoria) {
                throw new Error("Todos los campos son requeridos");
            }

            const payload: Omit<Subcategory, "id"> = {
                nombre: formData.nombre,
                id_categoria: formData.id_categoria
            };

            if (currentSubcategory && currentSubcategory.id) {
                const updated = await updateSubcategory(currentSubcategory.id, payload);
                setSubcategories(subcategories.map(sub =>
                    sub.id === currentSubcategory.id ? updated : sub
                ));
                showToast.success("Subcategoría Actualizada Correctamente");
            } else {
                const created = await createSubcategory(payload);
                setSubcategories([...subcategories, created]);
                showToast.success("Subcategoría Creada Correctamente");
            }

            setIsModalOpen(false);
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Error al guardar subcategoría";
            showToast.error(msg);
        }
    };


    const handleDelete = async (id: string) => {
        try {
            await deleteSubcategory(id);
            setSubcategories(subcategories.filter(sub => sub.id !== id));
            showToast.success("Subcategoría Eliminada Correctamente");
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Error al eliminar subcategoría";
            showToast.error(msg);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-gray-500">Cargando Subcategorías...</p>
            </div>
        );
    }

    return (
        <div className="px-4 pt-1 pb-4">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold text-gray-800 -mt-2">Subcategorías</h2>
                <PrimaryButton icon={Plus} onClick={handleCreate}>
                    Nueva Subcategoría
                </PrimaryButton>
            </div>

            <DataTable
                fields={[
                    { name: 'nombre', label: 'Nombre' },
                    {
                        name: 'id_categoria',
                        label: 'Categoría',
                        render: (value: string | { id_categoria: string }) => {
                            const categoryId = typeof value === 'object' ? value.id_categoria : value;
                            return categories.find(cat => cat.id === categoryId)?.nombre || 'N/A';
                        }
                    }
                ]}
                initialData={subcategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                className="mt-1"
            />

            <CrudModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentSubcategory ? "Editar Subcategoría" : "Nueva Subcategoría"}
                fields={subcategoryFields}
                initialData={currentSubcategory || {}}
                onSubmit={handleSubmit}
                onDelete={currentSubcategory ? () => currentSubcategory.id && handleDelete(currentSubcategory.id) : undefined}
                isEditing={!!currentSubcategory}
            />
        </div>
    );
}
