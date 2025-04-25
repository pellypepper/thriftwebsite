import React, { useState, useEffect, useRef } from "react";
import "./listing.css";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "../../features/sellSlice";
import {
  getUserItem,
  updateUserItem,
  deleteUserItem,
} from "../../features/listSlice";
import Notification from "../../component/notification/notify";
import Footer from "../../component/footer/footer";
import Edit from "../../component/util/edit";

const Listing = ({ userId }) => {
  const dispatch = useDispatch();
  const [editingProductId, setEditingProductId] = useState(null);
  const editRef = useRef(null);
  const { items = [] } = useSelector((state) => state.list || {});
  const [products, setProducts] = useState([]);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  useEffect(() => {
    try {
      dispatch(getUserItem(userId));
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (items && items.length > 0) {
      setProducts(items);
    }
  }, [items]);

  const handleMarkAsSold = async (id, available) => {
    try {
      const newAvailability = !available;

      const newUpdatedItem = await dispatch(
        updateUserItem({ userId, itemId: id, available: newAvailability })
      ).unwrap();
      if (newUpdatedItem) {
        setProducts(
          products.map((product) =>
            product.id === id
              ? { ...product, available: !product.available }
              : product
          )
        );
      } else {
        return "unable to update item";
      }
    } catch (error) {
      return error.message;
    }
  };
  const handleUpdateProduct = async (id, title, price, description, file) => {
    try {
      console.log(id, title, price)
      if (!id || !title || !price || !description) {
        setNotificationMessage("Please fill in all required details");
        setNotificationType("error");
        return;
      }
      console.log(id, title);
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);

      if (file) {
        formData.append("image_url", file);
      }

      try {
        const response = await dispatch(updateProduct(formData));

        if (updateProduct.fulfilled.match(response)) {
          setProducts(
            products.map((product) =>
              product.id === id
                ? { ...product, title, price, description, image_url: response.payload.image_url }
                : product
            )
          );
          setNotificationMessage("Product Updated successfully!");
          setNotificationType("success");
        } else {
          const message =
            typeof response.payload === "object"
              ? response.payload.error || "Something went wrong!"
              : response.payload;

          setNotificationMessage(message);
          setNotificationType("error");
        }

        setShowNotification(true);
      } catch (error) {
        setNotificationMessage("❌ Unable to update product");
        setNotificationType("error");
        setShowNotification(true);
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert("An error occurred while updating the product.");
    }
  };

 
  const handleEdit = (productId) => {
    setEditingProductId(editingProductId === productId ? null : productId);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const deletedItem = await dispatch(
        deleteUserItem({ userId, id })
      ).unwrap();

      if (deletedItem) {
        setProducts(products.filter((product) => product.id !== id));
        setNotificationMessage("Product deleted successfully!");
        setNotificationType("success");
        setShowNotification(true);
      } else {
        setNotificationMessage("Failed to delete product.");
        setNotificationType("error");
        setShowNotification(true);
      }
    } catch (error) {
      setNotificationMessage("Error deleting the product.");
      setNotificationType("error");
      setShowNotification(true);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="product-listing-container">
      <section className="box-container">
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className={`product-card ${!product.available ? "sold" : ""}`}
            >
              <div className="product-image-container">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="product-image"
                />
                {!product.available && <div className="sold-badge">Sold</div>}
              </div>

              <div className="product-details">
              

                <div className="product-footer">
                  <div className="product-pricing">
                  <h4 className="product-title">{product.title}</h4>
                    <p className="product-price">${product.price}</p>
                 
                  </div>

                  
                </div>
                <div className="product-actions">
                    <button
                      onClick={() =>
                        handleMarkAsSold(product.id, product.available)
                      }
                      className={`action-button ${
                        product.available ? "mark-available" : "mark-sold"
                      }`}
                    >
                      {product.available ? "Mark sold" : "Mark available"}
                    </button>
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="action-button edit"
                    >
                      {editingProductId === product.id ? "Cancel Edit" : "Edit"}
                    </button>
                  
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="action-button delete"
                    >
                      Delete
                    </button>
                  </div>
                  <span className="product-date">
                      Listed on{" "}
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
              </div>
              {editingProductId === product.id && (
                      <div ref={editRef} className='edit-wrapper'>
                        <Edit 
                          product={product}  // Pass the product data
                          onSave={(updatedData) => {
                            handleUpdateProduct(
                              product.id, 
                              updatedData.title, 
                              updatedData.price, 
                              updatedData.description,
                              updatedData.file // If there's a file to upload
                            );
                            setEditingProductId(null);
                          }}
                          onCancel={() => setEditingProductId(null)}
                        />
                      </div>
                    )}
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="empty-state">
            <p>No products listed yet</p>
          </div>
        )}

        <section className="listing-grid-2">
          <Footer />
        </section>
      </section>

     

      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)} // Hide notification after 5 seconds
        />
      )}
    </div>
  );
};

export default Listing;
