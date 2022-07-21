import React, { useEffect, useRef, useState, useCallback, SelectHTMLAttributes } from "react";
import {IconBaseProps} from 'react-icons'
import {FiAlertCircle} from 'react-icons/fi'
import { useField } from "@unform/core";
import { Container, Error } from "./styles";
import Tooltip from '../Tooltip';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>{
    name: string;
    icon?: React.ComponentType<IconBaseProps>;
}

const Select: React.FC<SelectProps> = ({name, icon: Icon, ...rest}) =>{
    const selectRef = useRef<HTMLSelectElement>(null);
    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    const {fieldName, defaultValue, error, registerField} = useField(name);

    const handleSelectBlur = useCallback (() => {
        setIsFocused(false)
        setIsFilled(!! selectRef.current?.value);
    
    }, []);

    const handleSelectFocus = useCallback (() => {
        setIsFocused(true) 
    }, []);

    useEffect(()  =>{
        registerField({
            name: fieldName,
            ref: selectRef.current,
            path: 'value',
        })
    }, [fieldName, registerField]);

    return (
        <Container isErrored={!! error} isFilled={isFilled} isFocused={isFocused}>
            {Icon && <Icon size={20}/>}
            <select  
                onFocus={handleSelectFocus}
                onBlur={handleSelectBlur}
                defaultValue={defaultValue}
                ref={selectRef} 
                {...rest}
            />  
            {error && 
                <Error title={error}>
                    <FiAlertCircle color="#c53030" size={20}/>
                </Error>
            }
        </Container>
    );
}

export default Select;