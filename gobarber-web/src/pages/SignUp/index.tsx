import React, {useCallback, useRef} from "react";
import { Container, Content, Background, AnimationContainer } from './styles';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { FormHandles } from "@unform/core";
import { Form } from '@unform/web'
import { Link } from "react-router-dom";
import * as Yup from 'yup';

import logo from '../../assets/logo.svg';
import Input from "../../components/input";
import Button from "../../components/button";
import getValidationErrors from "../../utils/getValidationErrors";


const SignUp: React.FC = () =>{

    const formRef = useRef<FormHandles>(null);

    console.log(formRef);

    const handleSubmit = useCallback(async (data: object) => {
        try {

            formRef.current?.setErrors({})

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
                password: Yup.string().min(6, 'Mínimo de 6 dígitos')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

        } catch (err: any) {
            console.log(err)
            //@ts-ignore ("Argument of type 'unknown' is not assignable to parameter of type 'ValidationError'")
            const errors = getValidationErrors(err);
            formRef.current?.setErrors(errors)
        }
    }, [])

    return(
        <>
        <Container>
            <Background/>
            <Content>
                <AnimationContainer>
                    <img src={logo} alt="Logo GoBarber"/>
                    <Form ref={formRef} onSubmit={handleSubmit} >
                        <h1>Faça seu cadastro</h1>
                        <Input name="name" icon={FiUser} placeholder="Nome"/>
                        <Input name="email" icon={FiMail} placeholder="E-mail"/>
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha"/>
                        <Button type="submit">Cadastrar</Button>
                    </Form>
                    <Link  to="/">
                        <FiArrowLeft/>
                        Voltar para logon
                    </Link>
                </AnimationContainer>
            </Content>
        </Container>
    </>
    )
};

export default SignUp;