import React, {createContext, useContext, useCallback, useState} from "react";
import { v4 as uuid } from 'uuid';
import ToastContainer from '../components/ToastContainer'

interface ToastContextData{
    addToast(message: Omit<ToastMessage, 'id'>): void;
    removeToast(id: string): void;
}

export interface ToastMessage{
    id: string;
    type?: 'info' | 'sucess' | 'error';
    title: string;
    description?: string;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider:React.FC<{ children: React.ReactNode }> = ({ children }) =>{

    const [messages, setMessasges, ] = useState<ToastMessage[]>([]);

    const addToast = useCallback(({type, title, description}: Omit<ToastMessage, 'id'>) => {
        const id = uuid();

        const toast = {
            id,
            type,
            title,
            description
        }
        
        setMessasges([... messages, toast]);
    },[messages])

    const removeToast = useCallback((id: string ) => {
        setMessasges((message) => message.filter((message) => message.id !== id))
    },[])

    return (
        <ToastContext.Provider value={{addToast, removeToast}}>
            {children}
            <ToastContainer messages={messages}/>
        </ToastContext.Provider>
    );
};

export function useToast(): ToastContextData{
    const context = useContext(ToastContext);

    if(!context){
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context; 
}