import React from "react";
import { Container, Toast } from "./styles";
import { FiAlertCircle, FiXCircle } from "react-icons/fi";

const ToastContainer: React.FC = () =>{
    return(
       <Container>
            <Toast>
                <FiAlertCircle size={20}/>
                <div>
                    <strong>Error</strong>
                    <p>An error ocurred on the application</p>
                </div>
                <button type="button"><FiXCircle size={18}/></button>
            </Toast>
            <Toast type="sucess">
                <FiAlertCircle size={20}/>
                <div>
                    <strong>Error</strong>
                    <p>An error ocurred on the application</p>
                </div>
                <button type="button"><FiXCircle size={18}/></button>
            </Toast>
            <Toast type="error">
                <FiAlertCircle size={20}/>
                <div>
                    <strong>Error</strong>
                    <p>An error ocurred on the application</p>
                </div>
                <button type="button"><FiXCircle size={18}/></button>
            </Toast>
       </Container>
    );
};

export default ToastContainer;