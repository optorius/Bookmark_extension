import { useState } from "react";
import PopupInput from "./PopupInput";
import classes from "./CategoryInput.module.css"

const CategoryInput = ({ value, onChange, categories }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (category) => {
    onChange({ target: { value: category } });
    setOpen(false);
  };

  return (
    <div className={classes.categoryInput}>
      <PopupInput
        type="text"
        value={value}
        onClick={() => setOpen(true)}
        onChange={onChange}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {open && (
        <ul>
          {categories.map((category, index) => (
            <li key={index} onClick={() => handleSelect(category)}>
              {category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryInput;
