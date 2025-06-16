import { useEffect, useCallback, memo } from "react";
import { Col, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory } from "../../features/CategoriSlice.js";
import { toast } from "react-toastify";
import {
  getAllByCategory,
  getAllProduct,
} from "../../features/ProductSlice.js";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { CiCoffeeCup } from "react-icons/ci";
import { FaUtensils } from "react-icons/fa";
import { TbBrandCakephp } from "react-icons/tb";
import { GiClothes } from "react-icons/gi";
import { LiaIconsSolid } from "react-icons/lia";

const ListCategory = memo(() => {
  const categorys = useSelector((state) => state.category.data);
  const loading = useSelector((state) => state.category.loading);
  const error = useSelector((state) => state.category.error);
  const dispatch = useDispatch();

  const setIcon = useCallback((id) => {
    switch (id) {
      case 1:
        return <FaUtensils />;
      case 2:
        return <CiCoffeeCup />;
      case 3:
        return <TbBrandCakephp />;
      case 4:
        return <GiClothes />;
      default:
        return <LiaIconsSolid />;
    }
  }, []);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
      });
    }
  }, [error]);

  const handleCategoryClick = useCallback((elem, categoryId) => {
    const activeElements = document.getElementsByClassName("active");
    for (let i = 0; i < activeElements.length; i++) {
      activeElements[i].classList.remove("active");
    }
    elem.classList.add("active");
    
    if (categoryId) {
      dispatch(getAllByCategory(categoryId));
    } else {
      dispatch(getAllProduct());
    }
  }, [dispatch]);

  return (
    <Col md={2}>
      <ListGroup>
        <ListGroup.Item
          action
          className="d-flex justify-content-between align-items-center"
          onClick={(e) => handleCategoryClick(e.target, null)}
        >
          <MdOutlineProductionQuantityLimits /> All Product
        </ListGroup.Item>
        {categorys.map((category) => (
          <ListGroup.Item
            key={category.id}
            action
            className="d-flex justify-content-between align-items-center"
            onClick={(e) => handleCategoryClick(e.target, category.id)}
          >
            {setIcon(category.id)} {category.kategoryName}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Col>
  );
});

export default ListCategory;
