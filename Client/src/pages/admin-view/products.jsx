import AdminFilterProduct from "@/components/admin-view/AdminFilterProduct";
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [filter, setFilter] = useState("all");

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Handle filter change
  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  // Filter products based on selected category or stock status
  const filteredProductList = productList.filter((product) => {
    switch (filter) {
      case "all":
        return true;
      case "men":
      case "women":
      case "kids":
      case "accessory":
      case "footwear":
        return product.category === filter;
      case "out-of-stock":
        return product.totalStock === 0;
      default:
        return true;
    }
  });

  // Submit form for adding or editing a product
  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            resetForm();
            toast({
              title: "Product Updated Successfully",
            });
          } else {
            toast({
              title: "Product Title cannot be the same",
              variant: "destructive",
            });
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            resetForm();
            toast({
              title: "Product added successfully",
            });
          } else {
            toast({
              title: "Product Title cannot be the same",
              variant: "destructive",
            });
          }
        });
  }

  // Handle product delete
  function handleDelete(getCurrentProductId) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(getCurrentProductId)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          toast({
            title: "Product deleted successfully",
          });
        }
      });
    }
  }

  // Check if the form is valid and ready to submit
  function isFormValid() {
    if (!formData) return false;

    return (
      Object.entries(formData)
        .filter(
          ([key, value]) => key !== "averageReview" && typeof value === "string"
        ) // Only input fields
        .every(([_, value]) => value.trim() !== "") && uploadedImageUrl !== "" // Ensure image is uploaded
    );
  }

  // Reset form to initial state
  function resetForm() {
    setFormData(initialFormData);
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setImageFile(null);
    setUploadedImageUrl("");
  }

  // Fetch all products on page load
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      {/* Filter and Add Product Button */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <AdminFilterProduct onFilterChange={handleFilterChange} />
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      {/* Display Products */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredProductList && filteredProductList.length > 0 ? (
          filteredProductList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-lg text-gray-900">
            <h1>No Product Found</h1>
          </div>
        )}
      </div>

      {/* Add/Edit Product Sheet */}
      <Sheet open={openCreateProductsDialog} onOpenChange={() => resetForm()}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          {/* Image Upload Component */}
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          {/* Add/Edit Form */}
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid() || imageLoadingState} // Disable when invalid or loading
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
