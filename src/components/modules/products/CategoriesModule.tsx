import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import {
    Category,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../../../services/products/categoriesService";
import { showToast } from "../../../components/shared/Toast";
import { useNavigate } from "react-router-dom";

export function CategoriesModule() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
                    navigate("/login");
                } else {
                    showToast.error("Error al cargar las categorías");
                    console.error("Failed to fetch categories:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [navigate]);

    const categoryFields: Field[] = [
        {
            name: "nombre",
            label: "Nombre de la categoría",
            type: "text",
            required: true
        }
    ];

    const handleCreate = () => {
        setCurrentCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        console.log("Editando categoría:", category);
        if (!category.id) {
            console.error("La categoría no tiene ID!");
            showToast.error("No se puede editar: categoría sin ID");
            return;
        }
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData: Record<string, any>) => {
        try {
            if (!formData.nombre) {
                throw new Error("El nombre de la categoría es requerido");
            }

            console.log("Enviando datos:", {
                nombre: formData.nombre,
                currentCategoryId: currentCategory?.id
            });

            if (currentCategory && currentCategory.id) {
                const updatedCategory = await updateCategory(currentCategory.id, {
                    nombre: formData.nombre
                });

                setCategories(categories.map(category =>
                    category.id === currentCategory.id ? updatedCategory : category
                ));
                showToast.success("Categoría Actualizada Correctamente");
            } else {
                const newCategory = await createCategory({
                    nombre: formData.nombre
                });
                setCategories([...categories, newCategory]);
                showToast.success("Categoría Creada Correctamente");
            }
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Error completo:", error);
            if (error.response?.status === 401) {
                showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
                navigate("/login");
            } else {
                const errorMessage = error.response?.data?.message ||
                    error.message ||
                    "Error al guardar la categoría";
                showToast.error(errorMessage);
                console.error("Detalles del error:", error.response?.data);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) {
            showToast.error("ID de categoría inválido");
            return;
        }

        try {
            await deleteCategory(id);
            setCategories(prevCategories =>
                prevCategories.filter(category => category.id !== id)
            );
            showToast.success("Categoría Eliminada Correctamente");
        } catch (error: any) {
            console.error("Error al eliminar:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
                navigate("/login");
            } else if (error.response?.status === 500) {
                showToast.error("Error en el servidor al eliminar la categoría");
            } else {
                showToast.error(error.response?.data?.message || "Error al eliminar la categoría");
            }
        }

        setIsModalOpen(false);
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-gray-600 text-lg font-medium animate-pulse">
                    Cargando Categorías...
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 pt-1 pb-4">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold text-gray-800 -mt-2">Gestión de Categorías</h2>
                <PrimaryButton icon={Plus} onClick={handleCreate}>
                    Nueva Categoría
                </PrimaryButton>
            </div>

            <DataTable
                fields={[
                    { name: 'nombre', label: 'Nombre' }
                ]}
                initialData={categories}
                onEdit={(category) => handleEdit(category)}
                onDelete={(id) => handleDelete(id)}
                className="mt-1"
            />

            <CrudModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentCategory ? "Editar Categoría" : "Nueva Categoría"}
                fields={categoryFields}
                initialData={currentCategory || {}}
                onSubmit={handleSubmit}
                onDelete={currentCategory ? () => currentCategory.id && handleDelete(currentCategory.id) : undefined}
                isEditing={!!currentCategory}
            />
        </div>
    );
}