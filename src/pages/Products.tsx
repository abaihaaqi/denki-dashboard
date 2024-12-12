import { useState } from "react";
import { Plus } from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import ProductForm from "../components/products/ProductForm";
import Modal from "../components/ui/Modal";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/product";

export default function Products() {
  const { products, isLoading, createProduct, updateProduct, deleteProduct } =
    useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCreate = (data: Omit<Product, "id">) => {
    createProduct(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  const handleUpdate = (data: Partial<Product>) => {
    if (selectedProduct) {
      updateProduct(
        { id: selectedProduct.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          },
        }
      );
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={deleteProduct}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProduct ? "Edit Product" : "Add Product"}
      >
        <ProductForm
          initialData={selectedProduct ?? undefined}
          onSubmit={selectedProduct ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
