import React, { useCallback, useRef } from "react";
import {Container, Content, Background, AnimationContainer} from './styles';
import {FiLogIn, FiMail} from 'react-icons/fi'
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import { useToast } from "../../hooks/toast";
import { Link } from "react-router-dom";
import * as Yup from 'yup';

import logo from '../../assets/logo.svg';
import Input from "../../components/input";
import Button from "../../components/button";
import getValidationErrors from "../../utils/getValidationErrors";

interface ForgotPasswordFormData{
    email: string,
    password: string
}

const ForgotPassword: React.FC = () => {
    
    const formRef = useRef<FormHandles>(null);

    const {addToast} = useToast();

    const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
        try {
            formRef.current?.setErrors({})

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            addToast({
                type: 'sucess',
                title: 'Sucesso',
                description: 'Email de Recuperação enviado com êxito'
            });

            // history.push('/dashboard');

        } catch (err: any) {

            if(err instanceof Yup.ValidationError){
                //@ts-ignore ("Argument of type 'unknown' is not assignable to parameter of type 'ValidationError'")
                const errors = getValidationErrors(err);
                formRef.current?.setErrors(errors)
            }

            addToast({
                type: 'error',
                title: 'Erro na recuperação se senha',
                description: 'Ocorreu um erro ao tentar recuperar a senha, tente novamente!',
            });
        }
    }, [addToast])
    
    return(
     <>
        <Container>
            <Content>
                <AnimationContainer>
                   <img src={logo} alt="Logo GoBarber"/>
                    <Form ref={formRef} onSubmit={handleSubmit} >
                        <h1>Recuperar de senha</h1>
                        <Input name="email" icon={FiMail} placeholder="E-mail"/>
                        <Button type="submit">Recuperar</Button>
                    </Form> 
                    <Link  to="/signup">
                        <FiLogIn/>
                       Voltar para Logon
                    </Link> 
                </AnimationContainer>
            </Content>
            <Background/>
        </Container>
    </>   
    )
};

export default ForgotPassword;