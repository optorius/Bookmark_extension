// массив опций
// небходимо сделать двустороннее связывание, сделать этот компонент управляемым
// для этого передаем callback onChange

import React from "react";
import classes from "./CustomSelect.module.css"

// onChange следит за измениями внутри селекта
const CustomSelect = ( {
                       options,
                       defaultValue,
                       value,
                       onChange
                   } ) =>
{
    return(
        <div className={classes.customSelectContainer}>
        <select
            className={classes.customSelect}
            value={value}
            onChange={ event => onChange( event.target.value) }
        >
            <option disabled value="sort by">{defaultValue}</option>
            {
                options.map( option =>
                    <option key={option.value} value={option.value}>
                        { option.name }
                    </option>
                )
            }
        </select>
        </div>
    );
};

export default CustomSelect;