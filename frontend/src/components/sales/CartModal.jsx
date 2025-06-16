import { Button, Form, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, memo } from "react";
import { deleteCart, updateCart } from "../../features/CartSlice.js";
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import secureLocalStorage from "react-secure-storage";

const CartModal = memo((props) => {
  const dispatch = useDispatch();
  const dataEdit = useSelector((state) => state.cart.dataEdit);
  const error = useSelector((state) => state.cart.error);
  const [data, setData] = useState({});

  const updateData = useCallback(() => {
    dispatch(updateCart(data));
  }, [dispatch, data]);

  const actionDelete = useCallback((id) => {
    const user = secureLocalStorage.getItem("user");
    const data = { id: id, userId: user.id };
    if (dispatch(deleteCart(data))) {
      props.onHide();
      toast.success("Data deleted", {
        position: "top-center",
      });
    }
  }, [dispatch, props]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
      });
    }
  }, [error]);

  const confirmDel = useCallback((id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-body-tertiary p-5 rounded shadow">
            <h1>Are you sure?</h1>
            <p>You want to delete this file?</p>
            <div className="text-center">
              <button className="btn btn-danger me-2" onClick={onClose}>
                <MdCancel /> No
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  actionDelete(id);
                  onClose();
                }}
              >
                <FaCheck /> Yes
              </button>
            </div>
          </div>
        );
      },
    });
  }, [actionDelete]);

  useEffect(() => {
    setData(dataEdit);
  }, [dataEdit]);

  return (
    <Modal
      {...props}
      size={props.size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Cart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={data.qty}
              onChange={(e) => setData({ ...data, qty: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => confirmDel(data.id)}>
          Delete
        </Button>
        <Button onClick={updateData}>Update</Button>
      </Modal.Footer>
    </Modal>
  );
});

CartModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  size: PropTypes.string,
};

export default CartModal;
