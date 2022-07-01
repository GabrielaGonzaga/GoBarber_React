import React, { useCallback, useRef } from "react";
import {Container, Content, Background, AnimationContainer} from './styles';
import {FiLogIn, FiMail, FiLock} from 'react-icons/fi'
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import { useToast } from "../../hooks/toast";
import {useAuth} from "../../hooks/auth";
import { Link } from "react-router-dom";
import * as Yup from 'yup';

import logo from '../../assets/logo.svg';
import Input from "../../components/input";
import Button from "../../components/button";
import getValidationErrors from "../../utils/getValidationErrors";

interface SignInFormData{
    email: string,
    password: string
}

const SignIn: React.FC = () => {
    
    const formRef = useRef<FormHandles>(null);

    const {signIn} = useAuth();
    const {addToast} = useToast();

    const handleSubmit = useCallback(async (data: SignInFormData) => {
        try {
            formRef.current?.setErrors({})

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
                password: Yup.string().required('Senha obrigatória')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await signIn({
                email: data.email,
                password: data.password, 
            });

            addToast({
                type: 'sucess',
                title: 'Login realizado com sucesso'
            });

        } catch (err: any) {

            if(err instanceof Yup.ValidationError){
                //@ts-ignore ("Argument of type 'unknown' is not assignable to parameter of type 'ValidationError'")
                const errors = getValidationErrors(err);
                formRef.current?.setErrors(errors)
            }

            addToast({
                type: 'error',
                title: 'Erro na autenticação',
                description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
            });
        }
    }, [signIn, addToast])
    
    return(
     <>
        <Container>
            <Content>
                <AnimationContainer>
                   <img src={logo} alt="Logo GoBarber"/>
                    <Form ref={formRef} onSubmit={handleSubmit} >
                        <h1>Faça seu logon</h1>
                        <Input name="email" icon={FiMail} placeholder="E-mail"/>
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha"/>
                        <Button name=""  type="submit">Entrar</Button>
                        <a href="forgot">Esqueci minha senha</a>
                    </Form> 
                    <Link  to="/signup">
                        <FiLogIn/>
                        Criar Conta
                    </Link> 
                </AnimationContainer>
            </Content>
            <Background/>
        </Container>
    </>   
    )
};

export default SignIn;